import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execa } from 'execa'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector/commands'
import { prepare } from '../android/prepare.js'
import runAndroid from '../android/run.js'
import { getLibSDKDir } from '../android/utils.js'
import { devDistPath } from '../android/www.js'
import { checkConfig } from '../app-plus/check.js'
import type { BuildOptions } from '../build.js'
import { App } from '../utils/app.js'
import { stripAnsiColors } from '../utils/exec.js'
import { watchFiles } from '../utils/file.js'
import { gitIgnorePath } from '../utils/git.js'
import Log from '../utils/log.js'
import { AppPlusOS } from '../utils/manifest.config.js'
import { AndroidDir, AndroidPath, IOSDir, UNIAPP_SDK_HOME } from '../utils/path.js'
import { trimEnd } from '../utils/util.js'
import { type ModuleClass, type PlatformAddOptions, installModules, uninstallModules } from './index.js'

const UNIAPP_ANDROID_SDK_URL =
  trimEnd(process.env.UNIAPP_ANDROID_SDK_URL, '/') || 'https://wtto00.github.io/uniapp-android-sdk'

const android: ModuleClass = {
  modules: ['@dcloudio/uni-app-plus', '@dcloudio/uni-uts-v1'],

  isInstalled() {
    return existsSync(AndroidDir)
  },

  async requirement() {
    // JAVA_HOME
    if (process.env.JAVA_HOME) {
      const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === 'win32' ? '.exe' : ''}`)
      if (existsSync(javaBinPath)) {
        const { stderr, stdout } = await execa`${javaBinPath} -version`
        const raw = (stdout || stderr).split('\n')[0]
        if (raw.includes(' version ')) {
          const version = (stdout || stderr).match(/build ([\d\.]+)/)?.[1]
          if (version?.startsWith('1.8')) {
            Log.success(`${raw}`)
          } else {
            Log.warn(`java@${version} 可能不支持，请下载 java@1.8`)
          }
        } else {
          Log.warn('检测 Java 版本失败了')
        }
      } else {
        Log.warn(`Java 可执行文件不存在: ${javaBinPath}`)
      }
    } else {
      Log.warn('没有设置环境变量: `JAVA_HOME` ')
    }
    // ANDROID_HOME
    if (process.env.ANDROID_HOME) {
      Log.success(`ANDROID_HOME=${process.env.ANDROID_HOME}`)
    } else {
      Log.warn('没有设置环境变量: `ANDROID_HOME` ')
    }
  },

  async platformAdd({ version }: PlatformAddOptions) {
    const manifest = App.getManifestJson()

    if (!manifest) throw Error('文件 manifest.json 解析失败')

    checkConfig(manifest, AppPlusOS.Android)

    await installModules(android.modules, version)

    const sdkDir = resolve(UNIAPP_SDK_HOME, 'android', version)
    if (!existsSync(sdkDir)) {
      // download sdk libs
      const spinner = ora('正在下载Android SDK Lib文件: ').start()
      const url = `${UNIAPP_ANDROID_SDK_URL}/libs/${version}/index.json`
      let sdkFiles: Record<string, string> = {}
      try {
        const fetchResult = await fetch(url)
        if (fetchResult.status === 404) {
          throw Error(`Android 平台暂不支持版本 ${version}`)
        }
        sdkFiles = await fetchResult.json()
        if (!sdkFiles) throw Error()
      } catch (error) {
        spinner.fail((error as Error).message)
        throw Error(`请求UniApp Android SDK@${version} 文件列表失败: ${url}\n网络问题或者暂不支持版本${version}`)
      }
      const targetDir = resolve(UNIAPP_SDK_HOME, 'android', `${version}-tmp`)
      if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true })
      try {
        for (const lib in sdkFiles) {
          spinner.text = `正在下载Android SDK Lib文件: ${lib}`
          const libPath = resolve(targetDir, lib)
          if (existsSync(libPath)) continue
          const libUrl = `${UNIAPP_ANDROID_SDK_URL}/libs/${sdkFiles[lib]}`
          const libFetchRes = await fetch(libUrl)
          const libContent = await libFetchRes.arrayBuffer()
          writeFileSync(libPath, new Uint8Array(libContent))
        }
        spinner.succeed('Android SDK Lib文件已下载完成')
        renameSync(targetDir, getLibSDKDir(version))
      } catch (error) {
        spinner.fail((error as Error).message)
        throw Error('下载Android SDK Lib文件失败了，请重试')
      }
    }

    try {
      cpSync(resolve(import.meta.dirname, '../../templates/android'), AndroidDir, { recursive: true })
      prepare()
    } catch (error) {
      rmSync(AndroidDir, { recursive: true, force: true })
      throw error
    }

    gitIgnorePath(AndroidPath)
  },

  async platformRemove() {
    if (!existsSync(IOSDir)) {
      await uninstallModules(android.modules)
    }
    rmSync(AndroidDir, { recursive: true, force: true })
  },

  async run(options: BuildOptions) {
    const pm = App.getPackageManager()
    const args = ['uni', '-p', 'app-android']
    if (options.mode) {
      args.push('--mode', options.mode)
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    try {
      let over = false
      let markHideError = false
      function* errTransform(line: string) {
        const lineText = stripAnsiColors(line)
        if (markHideError) {
          if (lineText.startsWith('file: ') || lineText.startsWith('at uni_modules/')) {
            Log.debug(lineText)
          } else {
            markHideError = false
            yield line
          }
          return
        }
        if (line === 'HBuilderX is not found') {
          // UTS插件错误
          Log.debug(lineText)
          if (!options.open || over) return
          over = true
          watchFiles(devDistPath, () => runAndroid(options), { immediate: true })
          return
        }
        if (
          lineText ===
          '[plugin:uni:uts-uni_modules] [uni:uts-uni_modules] 项目使用了uts插件，正在安装 uts Android 运行扩展...'
        ) {
          markHideError = true
          Log.debug(lineText)
          return
        }
        yield line
      }
      function* outTransform(line: string) {
        yield line
        if (!options.open || over) return
        const lineText = stripAnsiColors(line)
        if (lineText === 'DONE  Build complete. Watching for changes...') {
          over = true
          watchFiles(devDistPath, () => runAndroid(options), { immediate: true })
        }
      }
      execa({
        // @ts-ignore
        stderr: [errTransform, 'inherit'],
        stdout: [outTransform, 'inherit'],
        env: { FORCE_COLOR: 'true' },
        buffer: false,
      })`${commands.command} ${commands.args}`
    } catch (error) {
      if ((error as Error).message.match(/CTRL-C/)) return
      throw error
    }
  },

  async build(options: BuildOptions) {
    const pm = App.getPackageManager()
    const args = ['uni', 'build', '-p', 'app-android']
    if (options.mode) {
      args.push('--mode', options.mode)
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    try {
      const { stdout, stderr } = await execa({
        stderr: ['inherit', 'pipe'],
        stdout: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${commands.command} ${commands.args}`
      if (!options.open) return

      if (/DONE {2}Build complete\./.test(stdout)) {
        await runAndroid(options, true)
      }

      if (stderr) throw Error(stderr)
    } catch (error) {
      if ((error as Error).message.match(/CTRL-C/)) return
      throw error
    }
  },
}

export default android
