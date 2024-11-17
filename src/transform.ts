import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import inquirer from 'inquirer'
import ora from 'ora'
import { type PackageJson, readPackageJSON } from 'pkg-types'
import type ts from 'typescript'
import { App } from './utils/app.js'
import { errorMessage } from './utils/error.js'
import { readJsonFile } from './utils/file.js'
import Log from './utils/log.js'
import type { ManifestConfig } from './utils/manifest.config.js'
import { getPackageDependencies } from './utils/package.js'
import { showSpinner } from './utils/spinner.js'

const ignorePath = ['.hbuilderx', 'node_modules', 'dist']
const vue2IgnorePath = ['index.html']

const keepDirs = ['.git', '.vscode', 'public']

const keepFiles = [
  'androidPrivacy.json',
  'AndroidManifest.xml',
  'App.vue',
  'main.js',
  'manifest.json',
  'pages.json',
  'uni.promisify.adaptor.js',
]

const keepExtNames = ['scss', 'css', 'less']

const vue3template = 'https://gitee.com/dcloud/uni-preset-vue/raw/vite'
const vue2template = 'https://gitee.com/wtto00/uniapp-template/raw/main'

export interface TransformOptions {
  force?: boolean
}

export async function transform(source: string, target?: string, options?: TransformOptions) {
  const sourceDir = resolve(App.projectRoot, source)
  if (!existsSync(sourceDir)) {
    throw Error(`应用 ${source} 不存在`)
  }

  const notExistFile = ['manifest.json', 'pages.json', 'main.js'].find((file) => !existsSync(resolve(sourceDir, file)))
  if (notExistFile) {
    throw Error(`文件 ${notExistFile} 不存在，目录 ${source} 不是一个 uniapp 项目`)
  }

  let packageJson = undefined as PackageJson | undefined
  if (existsSync(resolve(sourceDir, 'package.json'))) {
    packageJson = await readPackageJSON(sourceDir)
  }

  const targetName = target || packageJson?.name || basename(source)
  const targetDir = resolve(App.projectRoot, targetName)

  const isSameDir = targetDir === sourceDir

  if (!target) {
    Log.info(`没有设定CLI项目位置，默认选择目录 ${targetName}`)
  }

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    if (!options?.force) {
      throw Error(`目录 ${targetName} 非空，请使用 \`--force\` 强制覆盖`)
    }
    if (!isSameDir) {
      await showSpinner(
        () => rm(targetDir, { force: true, recursive: true }),
        {
          start: `正在删除目录 ${targetName}`,
          succeed: `目录 ${targetName} 已成功删除`,
          fail: `目录 ${targetName} 删除失败`,
        },
        { throw: true, debug: false },
      )
    }
  }

  const { optionalDependencies } = await inquirer.prompt<{
    optionalDependencies: string[]
  }>([
    {
      type: 'checkbox',
      name: 'optionalDependencies',
      message: '是否使用以下所列举的服务?',
      choices: ['sass', 'pinia', 'vue-i18n', 'vue-router', 'vuex'],
      default: [],
    },
  ])

  const manifest = readJsonFile<ManifestConfig>(resolve(sourceDir, 'manifest.json'), true)
  const vue3 = manifest.vueVersion === '3'

  const files = readdirSync(sourceDir)

  const spinnner = ora('处理文件').start()

  try {
    for (const file of files) {
      spinnner.text = `正在处理文件: ${file}`
      const filePath = resolve(sourceDir, file)
      if (ignorePath.includes(file)) continue
      if (!vue3 && vue2IgnorePath.includes(file)) continue

      if (keepDirs.includes(file)) {
        if (isSameDir) continue
        await cp(filePath, resolve(targetDir, file), { recursive: true })
        continue
      }

      if (
        keepFiles.includes(file) ||
        keepExtNames.includes(extname(file).substring(1)) ||
        statSync(filePath).isDirectory()
      ) {
        if (isSameDir) {
          await rename(filePath, resolve(targetDir, 'src', file))
        } else {
          await cp(filePath, resolve(targetDir, 'src', file), { recursive: true })
        }
        continue
      }

      if (!isSameDir) {
        await cp(filePath, resolve(targetDir, file))
      }
    }

    spinnner.text = '正在处理文件: package.json'
    const packageUrl = vue3 ? `${vue3template}/package.json` : `${vue2template}/package.json`
    const packageRes = await fetch(packageUrl)
    if (!packageRes.ok) {
      throw Error(`获取 uniapp 版本信息出错了: ${packageRes.statusText}`)
    }
    const packageInfo: PackageJson = await packageRes.json()

    const packageVersion = manifest.versionName ?? ''

    if (packageJson) {
      packageJson.name ||= basename(targetName)
      packageJson.version ||= packageVersion
      const originUniVersion = getPackageDependencies(packageJson)['@dcloudio/uni-app']
      const templateUniVersion = getPackageDependencies(packageInfo)['@dcloudio/uni-app']
      const uniVersion = originUniVersion || templateUniVersion
      const ver = uniVersion.replace(/\D/g, '')
      if (vue3 && ver.startsWith('2')) {
        throw Error('本地安装的uniapp为vue2版本，与所选vue3不符')
      }
      if (!vue3 && ver.startsWith('3')) {
        throw Error('本地安装的uniapp为vue3版本，与所选vue2不符')
      }
      const dependenciesKeys = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
      for (const key of dependenciesKeys) {
        packageJson[key] ||= {}
        for (const dep in packageInfo[key]) {
          if (packageInfo[key][dep].includes(templateUniVersion)) {
            packageJson[key][dep] = uniVersion
          } else {
            packageJson[key][dep] = packageInfo[key][dep]
          }
        }
      }
    } else {
      packageJson = packageInfo
      packageJson.name = basename(targetName)
      if (packageVersion) packageJson.version = packageVersion
    }

    packageJson.scripts ||= {}
    packageJson.scripts.uniapp = 'uniapp'

    const modules = getPackageDependencies(packageJson)
    const uniVersion = modules['@dcloudio/uni-app']

    packageJson.dependencies ||= {}
    packageJson.devDependencies ||= {}
    for (const dep of optionalDependencies) {
      if (modules[dep]) continue
      if (!vue3) {
        if (dep === 'vue-i18n') {
          if (!modules['@dcloudio/uni-i18n']) packageJson.dependencies['@dcloudio/uni-i18n'] = uniVersion
          if (!modules['@dcloudio/uni-cli-i18n']) packageJson.devDependencies['@dcloudio/uni-cli-i18n'] = uniVersion
          continue
        }
        if (dep === 'vuex') {
          packageJson.dependencies[dep] = '^3.2.0'
          continue
        }
      }
      packageJson.dependencies[dep] = '*'
    }
    await writeFile(resolve(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

    const jsconfigPath = resolve(targetDir, 'jsconfig.json')
    if (existsSync(jsconfigPath)) {
      spinnner.text = '正在处理文件: jsconfig.json'
      const jsconfigContent = await readFile(jsconfigPath, 'utf8')
      let jsconfig = {} as { compilerOptions?: ts.CompilerOptions; include?: string[]; exclude?: string[] }
      try {
        jsconfig = JSON.parse(jsconfigContent)
        for (const key of ['include', 'exclude'] as const) {
          const value = [] as string[]
          for (const path of jsconfig[key] as string[]) {
            const match = path.match(/(\.\/|\/)?([\s\S]+)/)?.[2]
            if (
              match &&
              !keepDirs.some((item) => match.startsWith(item)) &&
              !ignorePath.some((item) => match.startsWith(item))
            ) {
              value.push(`src/${match}`)
            }
          }
          jsconfig[key] = value
        }
        for (const name in jsconfig.compilerOptions?.paths as Record<string, string[]>) {
          const alias = jsconfig.compilerOptions?.paths?.[name] ?? []
          const value = [] as string[]
          for (const path of alias) {
            const match = path.match(/(\.\/|\/)?([\s\S]+)/)?.[2]
            if (
              match &&
              !keepDirs.some((item) => match.startsWith(item)) &&
              !ignorePath.some((item) => match.startsWith(item))
            ) {
              value.push(`./src/${match}`)
            }
          }
          if (jsconfig.compilerOptions?.paths?.[name]) jsconfig.compilerOptions.paths[name] = value
        }
      } catch {}
      await writeFile(jsconfigPath, JSON.stringify(jsconfig, null, 2), 'utf8')
    }

    if (vue3) {
      spinnner.text = '正在处理文件: vite.config.js'
      const vitePath = resolve(targetDir, 'vite.config.js')
      if (!existsSync(vitePath)) {
        await writeFile(
          vitePath,
          `import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
})
`,
          'utf8',
        )
      }
    }

    spinnner.text = '正在处理文件: index.html'
    if (!vue3) {
      const res = await fetch(`${vue2template}/public/index.html`)
      if (res.ok) {
        const content = await res.text()
        const publicPath = resolve(targetDir, 'public')
        if (!existsSync(publicPath)) {
          await mkdir(publicPath, { recursive: true })
        }
        await writeFile(resolve(publicPath, 'index.html'), content, 'utf8')
      }
    } else {
      const indexHtmlPath = resolve(targetDir, 'index.html')
      if (existsSync(indexHtmlPath)) {
        const content = await readFile(indexHtmlPath, 'utf8')
        if (content) {
          await writeFile(indexHtmlPath, content.replace(/\/main\.js/, '/src/main.js'))
        }
      }
    }

    if (!vue3) {
      for (const file of ['babel.config.js', 'postcss.config.js', 'shims-uni.d.ts', 'shims-vue.d.ts', '.gitignore']) {
        spinnner.text = `正在处理文件: ${file}`
        const filePath = resolve(targetDir, file)
        if (!existsSync(filePath)) {
          const res = await fetch(`${vue2template}/${file}`)
          if (res.ok) {
            const content = await res.text()
            await writeFile(filePath, content, 'utf8')
          }
        }
      }
    } else {
      for (const file of ['shims-uni.d.ts', '.gitignore']) {
        spinnner.text = `正在处理文件: ${file}`
        const filePath = resolve(targetDir, file)
        if (!existsSync(filePath)) {
          const res = await fetch(`${vue3template}/${file}`)
          if (res.ok) {
            const content = await res.text()
            await writeFile(filePath, content, 'utf8')
          }
        }
      }
    }

    spinnner.text = '正在处理文件: .npmrc'
    const npmrcPath = resolve(targetDir, '.npmrc')
    const npmrcValues = {} as Record<string, string>
    if (existsSync(npmrcPath)) {
      const content = await readFile(npmrcPath, 'utf8')
      const lines = content.split('\n')
      for (const line of lines) {
        const [key, value] = line.trim().split('=')
        npmrcValues[key] = value
      }
    }
    npmrcValues['strict-peer-dependencies'] = 'false'
    npmrcValues['auto-install-peers'] = 'true'
    npmrcValues['shamefully-hoist'] = 'true'
    const npmrcContent = Object.keys(npmrcValues)
      .map((key) => `${key}=${npmrcValues[key]}`)
      .join('\n')
    await writeFile(npmrcPath, npmrcContent, 'utf8')

    spinnner.succeed(`应用 ${basename(sourceDir)} 已成功转换到 ${basename(targetDir)}`)

    Log.info(`
运行以下命令开始吧:
  cd ${targetName}
  ${App.getPackageManager({ notWarn: true }).name} install
  uniapp run h5
`)
  } catch (error) {
    spinnner.fail(errorMessage(error))
    if (!isSameDir) rmSync(targetDir, { force: true, recursive: true })
    throw Error()
  }
}
