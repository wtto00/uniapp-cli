import { cp, existsSync, mkdirSync, readFile, readdirSync, rmSync, statSync, writeFile, writeFileSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import inquirer from 'inquirer'
import ora from 'ora'
import { readPackageJSON } from 'pkg-types'
import { App } from './utils/app.js'
import { readJsonFile } from './utils/file.js'
import Log from './utils/log.js'
import type { ManifestConfig } from './utils/manifest.config.js'

const latestUniappVersion = '3.0.0-4020920240930001'

const keepFiles = [
  'androidPrivacy.json',
  'App.vue',
  'main.js',
  'main.ts',
  'manifest.json',
  'pages.json',
  'uni.promisify.adaptor.js',
  'uni.promisify.adaptor.ts',
]

const keepExtNames = ['scss', 'css', 'less']

const notSupportFiles = ['AndroidManifest.xml']

const keepDirs = ['.git']

const ignorePath = ['.hbuilderx', 'node_modules']

const dependencies: Record<string, string> = {
  '@dcloudio/uni-app': latestUniappVersion,
  '@dcloudio/uni-components': latestUniappVersion,
  '@dcloudio/uni-h5': latestUniappVersion,
  vue: '^3.4.21',
}
const devDependencies: Record<string, string> = {
  '@dcloudio/types': '^3.4.8',
  '@dcloudio/uni-automator': latestUniappVersion,
  '@dcloudio/uni-cli-shared': latestUniappVersion,
  '@dcloudio/uni-stacktracey': latestUniappVersion,
  '@dcloudio/vite-plugin-uni': latestUniappVersion,
  '@vue/runtime-core': '^3.4.21',
  vite: '^5.2.8',
}

export async function transform(source: string, target?: string) {
  const sourceDir = resolve(App.projectRoot, source)
  if (!existsSync(sourceDir)) {
    throw Error(`应用 ${source} 不存在`)
  }
  const dirname = target || basename(source)
  const targetDir = resolve(App.projectRoot, dirname)

  if (existsSync(targetDir)) {
    if (readdirSync(targetDir).length > 0) {
      throw Error(`目录 ${targetDir} 非空`)
    }
  } else {
    mkdirSync(targetDir, { recursive: true })
  }

  const { optionalDependencies } = await inquirer.prompt<{ optionalDependencies: string[] }>([
    {
      type: 'checkbox',
      name: 'optionalDependencies',
      message: '是否使用下面所列举的服务',
      choices: ['sass', 'pinia', 'vue-i18n', 'vue-router', 'vuex'],
      default: [],
    },
  ])

  try {
    const files = readdirSync(sourceDir)
    const spinnner = ora('正在复制文件').start()
    for (const file of files) {
      spinnner.text = `正在复制文件: ${file}`
      const filePath = resolve(sourceDir, file)
      if (ignorePath.includes(file)) continue
      if (
        keepFiles.includes(file) ||
        keepExtNames.includes(extname(file).substring(1)) ||
        (statSync(filePath).isDirectory() && !keepDirs.includes(file))
      ) {
        await new Promise((resolveCallback) => {
          cp(filePath, resolve(targetDir, 'src', file), { recursive: true }, (err) => {
            if (err) spinnner.info(`文件 ${file} 复制失败`)
            resolveCallback(undefined)
          })
        })
        continue
      }
      if (notSupportFiles.includes(file)) {
        Log.warn(`\n文件 ${file} 暂不支持，请手动处理`)
        continue
      }
      await new Promise((resolveCallback) => {
        cp(filePath, resolve(targetDir, file), { recursive: true }, (err) => {
          if (err) spinnner.info(`文件 ${file} 复制失败`)
          resolveCallback(undefined)
        })
      })
    }

    spinnner.text = '正在处理文件package.json'
    const packageJson = await readPackageJSON(targetDir)
    packageJson.name ||= basename(sourceDir)
    const manifest = readJsonFile<ManifestConfig>(resolve(targetDir, 'src', 'manifest.json'), true)
    packageJson.version ||= manifest.versionName
    if (!packageJson.scripts) packageJson.scripts = {}
    packageJson.scripts.dev = 'uniapp run h5'
    packageJson.scripts.build = 'uniapp build h5'
    packageJson.scripts.uniapp = 'uniapp'
    if (!packageJson.dependencies) packageJson.dependencies = {}
    for (const dep in dependencies) {
      packageJson.dependencies[dep] = dependencies[dep]
    }
    for (const dep of optionalDependencies) {
      packageJson.dependencies[dep] = 'latest'
    }
    if (!packageJson.devDependencies) packageJson.devDependencies = {}
    for (const dep in devDependencies) {
      packageJson.devDependencies[dep] = devDependencies[dep]
    }
    writeFileSync(resolve(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

    spinnner.text = '正在处理文件vite.config.js'
    const vitePath = resolve(targetDir, 'vite.config.js')
    if (!existsSync(vitePath)) {
      if (!existsSync(resolve(targetDir, 'vite.config.ts'))) {
        writeFileSync(
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

    spinnner.text = '正在处理文件index.html'
    const indexHtmlPath = resolve(targetDir, 'index.html')
    if (existsSync(indexHtmlPath)) {
      const content = await new Promise<string>((resolve) =>
        readFile(indexHtmlPath, 'utf8', (err, data) => {
          if (err) spinnner.info('文件 index.html 读取失败')
          resolve(data)
        }),
      )
      if (content) {
        await new Promise((resolve) =>
          writeFile(indexHtmlPath, content.replace(/(\/main\.[jt]s)/, '/src$1'), (err) => {
            if (err) spinnner.info('文件 index.html 写入失败')
            resolve(undefined)
          }),
        )
      }
    }

    spinnner.succeed(`应用 ${basename(sourceDir)} 已成功转换到 ${basename(targetDir)}`)

    Log.info(`
运行下面的命令开始:
\tcd ${dirname}
\t${App.getPackageManager({ notWarn: true }).name} install
\tuniapp run h5
`)
  } catch (error) {
    rmSync(targetDir, { force: true, recursive: true })
    throw error
  }
}
