import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execa } from 'execa'
import ora from 'ora'
import addAndroid from '../android/add.js'
import { getLibSDKDir } from '../android/utils.js'
import type { BuildOptions } from '../build.js'
import { gitIgnorePath } from '../utils/git.js'
import { Log } from '../utils/log.js'
import { UNIAPP_SDK_HOME, androidDir, androidPath, iosDir } from '../utils/path.js'
import { trimEnd } from '../utils/util.js'
import { type ModuleClass, type PlatformAddOptions, installModules, uninstallModules } from './index.js'

const UNIAPP_ANDROID_SDK_URL =
  trimEnd(process.env.UNIAPP_ANDROID_SDK_URL, '/') || 'https://wtto00.github.io/uniapp-android-sdk'

const android: ModuleClass = {
  modules: ['@dcloudio/uni-app-plus'],

  async requirement() {
    // JAVA_HOME
    if (process.env.JAVA_HOME) {
      const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === 'win32' ? '.exe' : ''}`)
      if (existsSync(javaBinPath)) {
        const { stderr, stdout } = await execa`${javaBinPath} -version`
        const version = (stdout || stderr).split('\n')[0]
        if (version.includes(' version ')) {
          Log.success(`${Log.successEmoji} ${version}`)
        } else {
          Log.warn(`${Log.failEmoji} 检测 Java 版本失败了。`)
        }
      } else {
        Log.warn(`${Log.failEmoji} Java 可执行文件不存在: ${javaBinPath}。`)
      }
    } else {
      Log.warn(`${Log.failEmoji} 没有设置环境变量: \`JAVA_HOME\` 。`)
    }
    // ANDROID_HOME
    if (process.env.ANDROID_HOME) {
      Log.success(`${Log.successEmoji} ANDROID_HOME=${process.env.ANDROID_HOME}`)
    } else {
      Log.warn(`${Log.failEmoji} 没有设置环境变量: \`ANDROID_HOME\` 。`)
    }
  },

  async platformAdd({ version }: PlatformAddOptions) {
    await installModules(android.modules, version)

    const sdkDir = resolve(UNIAPP_SDK_HOME, 'android', version)
    if (!existsSync(sdkDir)) {
      // download sdk libs
      const spinner = ora('正在下载Android SDK Lib文件: ').start()
      const url = `${UNIAPP_ANDROID_SDK_URL}/libs/${version}/index.json`
      let sdkFiles: Record<string, string> = {}
      try {
        const fetchResult = await fetch(url)
        sdkFiles = await fetchResult.json()
        if (!sdkFiles) throw Error()
      } catch (error) {
        spinner.fail((error as Error).message)
        throw Error(`请求UniApp Android SDK@${version} 文件列表失败: ${url}\n网络问题或者暂不支持版本${version}。`)
      }
      const targetDir = resolve(UNIAPP_SDK_HOME, 'android', `${version}-tmp`)
      if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true })
      try {
        for (const lib in sdkFiles) {
          spinner.text = `正在下载Android SDK Lib文件: ${lib}`
          const libUrl = `${UNIAPP_ANDROID_SDK_URL}/libs/${sdkFiles[lib]}`
          const libFetchRes = await fetch(libUrl)
          const libContent = await libFetchRes.arrayBuffer()
          writeFileSync(resolve(targetDir, lib), new Uint8Array(libContent))
        }
        spinner.succeed('Android SDK Lib文件已下载完成')
        renameSync(targetDir, getLibSDKDir(version))
      } catch (error) {
        spinner.fail((error as Error).message)
        rmSync(targetDir, { recursive: true, force: true })
        throw Error('下载Android SDK Lib文件失败了，请重试')
      }
    }

    try {
      await addAndroid(version)
    } catch (error) {
      rmSync(androidDir, { recursive: true, force: true })
      throw error
    }

    gitIgnorePath(androidPath)

    Log.success(`Android 平台已成功添加。${Log.successEmoji}`)
  },

  async platformRemove() {
    if (!existsSync(iosDir)) {
      await uninstallModules(android.modules)
    }
    rmSync(androidDir, { recursive: true, force: true })
    Log.success('Android 平台已成功移除。')
  },

  run(_options: BuildOptions) {
    // const uniappProcess = spawnExec('npx', ['uni', '-p', 'app-android'], async (msg) => {
    //   const doneChange = /DONE {2}Build complete\. Watching for changes\.{3}/.test(msg)
    //   if (!doneChange) return
    //   Log.info('\nstart build android:')
    //   const scriptPath = resolve(projectRoot, 'node_modules/uniapp-android/dist/run.js')
    //   if (!existsSync(scriptPath)) {
    //     Log.error(`File \`${scriptPath}\` does't exist.`)
    //     killChildProcess(uniappProcess)
    //     return
    //   }
    //   const build = await dynamicImport<(options: BuildOptions) => Promise<string>>(scriptPath)
    //   try {
    //     const deviceName = await build(options)
    //     if (!options.device) options.device = deviceName
    //   } catch (error) {
    //     Log.error((error as Error).message)
    //     killChildProcess(uniappProcess)
    //   }
    // })
  },

  build(_options: BuildOptions) {},
}

export default android
