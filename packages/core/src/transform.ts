import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { checkbox } from '@inquirer/prompts'
import fetch from 'node-fetch'
import ora from 'ora'
import { type PackageJson, readPackageJSON } from 'pkg-types'
import { ProxyAgent } from 'proxy-agent'
import type ts from 'typescript'
import { App } from './utils/app.js'
import { errorDebugLog, errorMessage } from './utils/error.js'
import { readJsonFile } from './utils/file.js'
import Log from './utils/log.js'
import type { ManifestConfig } from './utils/manifest.config.js'
import { getPackageDependencies } from './utils/package.js'
import { showSpinner } from './utils/spinner.js'

const ignorePath = ['.hbuilderx', 'node_modules', 'dist']
const vue2IgnorePath = ['index.html']

const keepDirs = ['.git', '.vscode', 'public']

const srcFiles = [
  'androidPrivacy.json',
  'AndroidManifest.xml',
  'App.vue',
  'main.js',
  'manifest.json',
  'pages.json',
  'uni.promisify.adaptor.js',
]

const srcExtNames = ['scss', 'css', 'less']

const vue3template = 'https://gitee.com/dcloud/uni-preset-vue/raw/vite'
const vue2template = 'https://gitee.com/wtto00/uniapp-template/raw/main'

const hbuilderxModules = ['sass', 'pinia', 'i18n', 'vuex', 'router'] as const

type HBuilderXModule = (typeof hbuilderxModules)[number]

export interface TransformOptions {
  force?: boolean
  module?: string[] | true
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

  let builtInModules = options?.module
  if (!builtInModules) {
    builtInModules = await checkbox<string>({
      message: '是否使用以下所列举的服务?',
      choices: hbuilderxModules,
    })
  } else {
    if (builtInModules === true) {
      builtInModules = []
    } else {
      builtInModules = builtInModules.filter((module) => hbuilderxModules.includes(module as HBuilderXModule))
    }
    if (builtInModules.length) {
      Log.info(`包含HBuilderX内置模块: ${builtInModules.join(', ')}`)
    } else {
      Log.info('不包含HBuilderX内置模块依赖')
    }
  }

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
        srcFiles.includes(file) ||
        srcExtNames.includes(extname(file).substring(1)) ||
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
    const agent = new ProxyAgent()
    const packageRes = await fetch(packageUrl, { agent })
    if (!packageRes.ok) {
      throw Error(`获取 uniapp 版本信息出错了: ${packageRes.statusText}`)
    }
    const packageInfo = (await packageRes.json()) as PackageJson

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

    const allDependencies = getPackageDependencies(packageJson)
    const uniVersion = allDependencies['@dcloudio/uni-app']

    packageJson.dependencies ||= {}
    packageJson.devDependencies ||= {}
    for (const module of builtInModules) {
      switch (module as HBuilderXModule) {
        case 'i18n':
          if (vue3) {
            if (!allDependencies['vue-i18n']) packageJson.dependencies['vue-i18n'] = '*'
          } else {
            if (!allDependencies['@dcloudio/uni-i18n']) packageJson.dependencies['@dcloudio/uni-i18n'] = uniVersion
            if (!allDependencies['@dcloudio/uni-cli-i18n'])
              packageJson.devDependencies['@dcloudio/uni-cli-i18n'] = uniVersion
          }
          break
        case 'vuex':
          if (allDependencies.vuex) continue
          packageJson.dependencies.vuex = vue3 ? '*' : '^3.2.0'
          break
        case 'router':
          if (allDependencies['vue-router']) continue
          packageJson.dependencies['vue-router'] = '*'
          break
        default:
          if (allDependencies[module]) continue
          packageJson.dependencies[module] = '*'
          break
      }
    }
    await writeFile(resolve(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

    const jsconfigPath = resolve(targetDir, 'jsconfig.json')
    if (existsSync(jsconfigPath)) {
      spinnner.text = '正在处理文件: jsconfig.json'
      const jsconfigContent = await readFile(jsconfigPath, 'utf8')
      let jsconfig = {} as { compilerOptions?: ts.CompilerOptions; include?: string[]; exclude?: string[] }
      try {
        jsconfig = JSON.parse(jsconfigContent)
        function transformPath(paths?: string[]) {
          const value = [] as string[]
          for (const path of paths || []) {
            const matches = path.match(/(\.\/|\/)?([\s\S]+)/)
            const match = matches?.[2] ?? ''
            if (
              match === '*' ||
              (match &&
                !keepDirs.some((item) => match.startsWith(item)) &&
                !ignorePath.some((item) => match.startsWith(item)))
            ) {
              const index = match.indexOf('/')
              if (index < 0 && match !== '*' && !existsSync(resolve(targetDir, 'src', match))) {
                value.push(path)
              } else {
                value.push(`${matches?.[1] ?? ''}src/${match}`)
              }
            } else {
              value.push(path)
            }
          }
          return value
        }
        for (const key of ['include', 'exclude'] as const) {
          jsconfig[key] = transformPath(jsconfig[key])
        }
        jsconfig.compilerOptions ||= {}
        jsconfig.compilerOptions.paths ||= {}
        for (const name in jsconfig.compilerOptions.paths as Record<string, string[]>) {
          jsconfig.compilerOptions.paths[name] = transformPath(jsconfig.compilerOptions.paths[name])
        }
        if (
          !jsconfig.compilerOptions.paths['@'] &&
          !jsconfig.compilerOptions.paths['@/'] &&
          !jsconfig.compilerOptions.paths['@/*']
        ) {
          jsconfig.compilerOptions.paths['@'] = ['./src']
        }
      } catch (error) {
        errorDebugLog(error)
      }
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
