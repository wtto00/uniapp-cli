import { cpSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import Android from '@wtto00/android-tools'
import { type ResultPromise, execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import ora from 'ora'
import type { BuildOptions } from '../build.js'
import { App } from '../utils/app.js'
import { errorMessage } from '../utils/error.js'
import Log from '../utils/log.js'
import { AndroidDir, AndroidPath } from '../utils/path.js'
import { cleanAndroid } from './clean.js'
import { getGradleExePath } from './gradle.js'
import { prepare } from './prepare.js'
import { assetsAppsPath, buildDistPath, devDistPath, getWwwPath } from './www.js'

let logcatProcess: ResultPromise<{
  stdout: ('inherit' | GeneratorTransform<false>)[]
  stderr: 'inherit'
  buffer: false
  reject: false
}>

function killLogcat() {
  if (logcatProcess && !logcatProcess.killed) {
    logcatProcess.kill()
  }
}

export default async function run(options: BuildOptions, isBuild?: boolean) {
  killLogcat()
  Log.debug('清理 Android 资源')
  // await cleanAndroidBuild()
  cleanAndroid()
  Log.info('准备 Android 打包所需资源')
  prepare({ debug: true })
  Log.debug('前端打包资源嵌入 Android 资源中')
  if (existsSync(assetsAppsPath)) {
    rmSync(assetsAppsPath, { recursive: true })
  }
  cpSync(isBuild ? buildDistPath : devDistPath, getWwwPath(), { recursive: true })
  const gradleExePath = getGradleExePath()

  let argv = 'assembleDebug'
  if (isBuild) {
    if (options.bundle === 'aab') argv = 'bundleRelease'
    else argv = 'assembleRelease'
  }
  try {
    await execa({
      stdio: 'inherit',
      env: { FORCE_COLOR: 'true' },
      cwd: AndroidDir,
    })`${gradleExePath} ${argv}`
  } catch {
    Log.error('Android 打包出错了')
    process.exit(1)
  }

  let apkPath = `${AndroidPath}/app/build/outputs`
  if (isBuild) {
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
    if (await android.isInstalled(deviceName, packagename)) {
      await android.adb(deviceName, `shell pm clear ${packagename}`)
    }
    const apkFullPath = resolve(App.projectRoot, apkPath)
    await android.install(deviceName, apkFullPath, { r: true })
    spinner.succeed(`已成功安装 ${apkPath} 到设备 ${deviceName} 上`)

    await android.adb(deviceName, 'logcat -c')

    Log.debug('开始拉起App')
    await android.adb(deviceName, `shell am start -n ${packagename}/io.dcloud.PandoraEntry`)

    logcatProcess = execa({
      stdout: [
        function* (line: string) {
          yield line.replace(/I\/console \( \d+\)/g, '')
        } as GeneratorTransform<false>,
        'inherit',
      ],
      stderr: 'ignore',
      buffer: false,
      reject: false,
    })`${android.adbBin} logcat console:D *:S -v raw -v color -v time`
  } catch (error) {
    Log.error(`出错了: ${errorMessage(error)}`)
    killLogcat()
  }
}
