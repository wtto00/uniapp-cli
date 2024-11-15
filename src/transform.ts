import { cp, existsSync, readFile, readdirSync, rename, rmSync, statSync, writeFile, writeFileSync } from 'node:fs'
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
const tsDependencies: Record<'dev' | 'deps', Record<string, string>> = {
  deps: {},
  dev: {
    '@vue/tsconfig': '^0.1.3',
    typescript: '^4.9.4',
    'vue-tsc': '^1.0.24',
  },
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

export interface TransformOptions {
  force?: boolean
}

export async function transform(source: string, target?: string, options?: TransformOptions) {
  const sourceDir = resolve(App.projectRoot, source)
  if (!existsSync(sourceDir)) {
    throw Error(`应用 ${source} 不存在`)
  }
  const targetName = target || basename(source)
  const targetDir = resolve(App.projectRoot, targetName)

  const isSameDir = targetDir === sourceDir

  if (isSameDir) {
    if (!options?.force) {
      throw Error('转换后的目录与原目录相同，请使用 `--force` 参数强制修改原项目')
    }
  } else if (!target) {
    Log.info(`没有设定CLI项目位置，默认选择目录 ${targetName}`)
  }

  if (!isSameDir && existsSync(targetDir)) {
    if (readdirSync(targetDir).length > 0) {
      if (options?.force) {
        rmSync(targetDir, { force: true, recursive: true })
      } else {
        throw Error(`目录 ${targetName} 非空，使用 \`--force\` 强制覆盖`)
      }
    }
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
    const spinnner = ora('正在处理文件').start()
    for (const file of files) {
      spinnner.text = `正在处理文件: ${file}`
      const filePath = resolve(sourceDir, file)
      if (ignorePath.includes(file)) continue
      if (
        keepFiles.includes(file) ||
        keepExtNames.includes(extname(file).substring(1)) ||
        (statSync(filePath).isDirectory() && !keepDirs.includes(file))
      ) {
        if (isSameDir) {
          await new Promise((resolveCallback) => {
            rename(filePath, resolve(targetDir, 'src', file), (err) => {
              if (err) spinnner.info(`文件 ${file} 移动失败`)
              resolveCallback(undefined)
            })
          })
        } else {
          await new Promise((resolveCallback) => {
            cp(filePath, resolve(targetDir, 'src', file), { recursive: true }, (err) => {
              if (err) spinnner.info(`文件 ${file} 复制失败`)
              resolveCallback(undefined)
            })
          })
        }
        continue
      }
      if (notSupportFiles.includes(file)) {
        Log.warn(`\n文件 ${file} 暂不支持，请手动处理`)
        continue
      }
      if (!isSameDir) {
        await new Promise((resolveCallback) => {
          cp(filePath, resolve(targetDir, file), { recursive: true }, (err) => {
            if (err) spinnner.info(`文件 ${file} 复制失败`)
            resolveCallback(undefined)
          })
        })
      }
    }

    const isTS = existsSync(resolve(targetDir, 'src', 'main.ts'))

    spinnner.text = '正在处理文件package.json'
    const packageJson = await readPackageJSON(targetDir)
    packageJson.name ||= basename(sourceDir)
    const manifest = readJsonFile<ManifestConfig>(resolve(targetDir, 'src', 'manifest.json'), true)
    packageJson.version ||= manifest.versionName
    if (!packageJson.scripts) packageJson.scripts = {}
    packageJson.scripts.dev = 'uniapp run h5'
    packageJson.scripts.build = 'uniapp build h5'
    packageJson.scripts.uniapp = 'uniapp'
    if (isTS) packageJson.scripts['type-check'] = 'vue-tsc --noEmit'
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
    if (isTS) {
      for (const dep in tsDependencies.deps) {
        packageJson.dependencies[dep] = tsDependencies.deps[dep]
      }
      for (const dep in tsDependencies.dev) {
        packageJson.devDependencies[dep] = tsDependencies.dev[dep]
      }
    }
    writeFileSync(resolve(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

    const tsconfigName = `${isTS ? 't' : 'j'}sconfig.json`
    spinnner.text = `正在处理文件${tsconfigName}`
    const tsconfigPath = resolve(targetDir, tsconfigName)
    if (!existsSync(tsconfigPath)) {
      writeFileSync(
        tsconfigPath,
        isTS
          ? `{
  "extends": "@vue/tsconfig/tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "lib": ["esnext", "dom"],
    "types": ["@dcloudio/types"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}`
          : `{
  "compilerOptions": {
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "lib": ["esnext", "dom"],
    "types": ["@dcloudio/types"]
  },
  "include": ["src/**/*.js", "src/**/*.jsx", "src/**/*.vue"]
}`,
        'utf8',
      )
    } else {
      spinnner.info(`检测到文件 ${tsconfigName} , 请手动修改 paths 配置`)
    }

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
\tcd ${targetName}
\t${App.getPackageManager({ notWarn: true }).name} install
\tuniapp run h5
`)
  } catch (error) {
    rmSync(targetDir, { force: true, recursive: true })
    throw error
  }
}
