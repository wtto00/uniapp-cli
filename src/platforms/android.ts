import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ora from 'ora'
import addAndroid from '../android/add.js'
import type { BuildOptions } from '../build.js'
import { getOutput, installPackages, spawnExecSync, uninstallPackages } from '../utils/exec.js'
import { Log } from '../utils/log.js'
import { isInstalled } from '../utils/package.js'
import { androidDir, androidPath, UNIAPP_SDK_HOME } from '../utils/path.js'
import { trimEnd } from '../utils/util.js'
import type { CommonOptions, ModuleClass, PlatformAddOptions } from './index.js'
import { getLibSDKDir } from '../android/utils.js'
import { gitIgnorePath } from '../utils/git.js'

const UNIAPP_ANDROID_SDK_URL =
  trimEnd(process.env.UNIAPP_ANDROID_SDK_URL, '/') || 'https://wtto00.github.io/uniapp-android-sdk'

const modules = ['@dcloudio/uni-app-plus']

function requirement() {
  // JAVA_HOME
  if (process.env.JAVA_HOME) {
    const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === 'win32' ? '.exe' : ''}`)
    if (existsSync(javaBinPath)) {
      const res = getOutput(spawnExecSync(javaBinPath, ['-version']))
      const version = res.split('\n')[0]
      Log.success(`${Log.emoji.success} ${version}`)
    } else {
      Log.warn(`${Log.emoji.fail} Java exec bin file is not exists.`)
    }
  } else {
    Log.warn(`${Log.emoji.fail} JAVA_HOME is not set.`)
  }
  // ANDROID_HOME
  if (process.env.ANDROID_HOME) {
    Log.success(`${Log.emoji.success} ANDROID_HOME=${process.env.ANDROID_HOME}`)
  } else {
    Log.warn(`${Log.emoji.fail} ANDROID_HOME is not set.`)
  }
}

async function platformAdd({ packages, version }: PlatformAddOptions) {
  for (const module of modules) {
    if (!isInstalled(packages, module)) {
      installPackages([module])
    }
  }

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

  Log.success('Android 平台已成功添加。')
}

async function platformRemove({ packages }: CommonOptions) {
  for (const module of modules) {
    if (isInstalled(packages, module)) {
      uninstallPackages([module])
    }
  }
  rmSync(androidDir, { recursive: true, force: true })
  Log.success('Android 平台已成功移除。')
}

function run(_options: BuildOptions) {
  // const uniappProcess = spawnExec('npx', ['uni', '-p', 'app-android'], async (msg) => {
  //   const doneChange = /DONE {2}Build complete\. Watching for changes\.{3}/.test(msg)
  //   if (!doneChange) return
  //   Log.info('\nstart build android:')
  //   const scriptPath = resolve(global.projectRoot, 'node_modules/uniapp-android/dist/run.js')
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
}

function build(_options: BuildOptions) {}

export default {
  modules,
  requirement,
  platformAdd,
  platformRemove,
  run,
  build,
} satisfies ModuleClass
