import { resolve } from 'node:path'
import Android from '@wtto00/android-tools'
import { execa } from 'execa'
import ora from 'ora'
import type { BuildOptions } from '../build.js'
import { App } from '../utils/app.js'
import { errorDebugLog, errorMessage } from '../utils/error.js'
import Log from '../utils/log.js'
import { AndroidDir, AndroidPath } from '../utils/path.js'
import { cleanAndroid } from './clean.js'
import { getGradleExePath } from './gradle.js'
import { prepare } from './prepare.js'

let logcatProcessController = new AbortController()

function killLogcat() {
  logcatProcessController.abort()
}

export interface AndroidBuildOptions {
  isBuild?: boolean
  isHbuilderX?: boolean
  socket?: {
    host: string
    port: number
  }
}

export async function buildAndroid(options: BuildOptions, runOptions?: AndroidBuildOptions) {
  killLogcat()
  Log.debug('清理 Android 资源')
  // await cleanAndroidBuild()
  cleanAndroid()

  Log.info('准备 Android 打包所需资源')
  prepare({ isBuild: runOptions?.isBuild, isHBuilderX: runOptions?.isHbuilderX })

  const gradleExePath = getGradleExePath()
  let argv = 'assembleDebug'
  if (runOptions?.isBuild) {
    if (options.bundle === 'aab') argv = 'bundleRelease'
    else argv = 'assembleRelease'
  }
  try {
    await execa({
      stdio: 'inherit',
      env: { FORCE_COLOR: 'true' },
      cwd: AndroidDir,
    })`${gradleExePath} ${argv}`
  } catch (error) {
    errorDebugLog(error)
    Log.error('Android 打包出错了')
    process.exit(1)
  }

  let apkPath = `${AndroidPath}/app/build/outputs`
  if (runOptions?.isBuild) {
    if (options.bundle === 'aab') {
      apkPath += '/bundle/release/app-release.aab'
    } else {
      apkPath += '/apk/release/app-release.apk'
    }
  } else {
    apkPath += '/apk/debug/app-debug.apk'
  }
  Log.success(`Android打包成功: ${apkPath}`)

  try {
    const android = new Android()
    const allDevices = await android.devices()
    const devices = allDevices.filter((item) => item.status === 'device')
    if (devices.length === 0) {
      Log.warn('没有已连接的设备')
      return
    }
    if (options.device && !devices.find((item) => item.name === options.device)) {
      Log.warn(`设备: ${options.device} 没有连接`)
      return
    }
    const deviceName = options.device || devices[0].name
    const manifest = App.getManifestJson()
    const packagename = manifest['app-plus']?.distribute?.android?.packagename ?? ''
    const spinner = ora(`安装 ${apkPath} 到设备 \`${deviceName}\``).start()
    try {
      const apkFullPath = resolve(App.projectRoot, apkPath)
      await android.install(deviceName, apkFullPath, { r: true })
      spinner.succeed(`已成功安装 ${apkPath} 到设备 ${deviceName} 上`)
    } catch (error) {
      spinner.fail('apk安装失败')
      errorDebugLog(error)
      throw error
    }

    if (!runOptions?.isBuild) await android.adb(deviceName, 'logcat -c')

    Log.debug('开始拉起App')
    if (runOptions?.isBuild) {
      // build
      await android.adb(deviceName, `shell am start -n ${packagename}/io.dcloud.PandoraEntry`)
    } else {
      // debug
      let command = `shell am start -n ${packagename}/io.dcloud.debug.PullDebugActivity`
      if (runOptions?.socket) {
        command += ` --es appid ${manifest.appid} --es ip ${runOptions.socket.host} --es port ${runOptions.socket.port}`
      }
      await android.adb(deviceName, command)
    }

    if (!runOptions?.isBuild) {
      logcatProcessController = new AbortController()
      await execa({
        stdout: 'inherit',
        stderr: 'ignore',
        buffer: false,
        reject: false,
        cancelSignal: logcatProcessController.signal,
      })`${android.adbBin} -s ${deviceName} logcat console:D jsLog:D weex:E aaa:D *:S -v raw -v color -v time`
    }
  } catch (error) {
    Log.error(`出错了: ${errorMessage(error)}`)
    killLogcat()
  }
}
