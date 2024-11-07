import { cpSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import Android from '@wtto00/android-tools'
import { execa } from 'execa'
import type { BuildOptions } from '../build.js'
import { App } from '../utils/app.js'
import Log from '../utils/log.js'
import { AndroidDir, AndroidPath } from '../utils/path.js'
import { getGradleExePath } from './gradle.js'
import { prepare } from './prepare.js'
import { initSignEnv } from './sign.js'

export default async function run(options: BuildOptions) {
  const manifest = App.getManifestJson()
  prepare(manifest, true)
  initSignEnv(manifest)
  const appsDir = resolve(AndroidDir, 'app/src/main/assets/apps')
  if (existsSync(appsDir)) {
    rmSync(appsDir, { recursive: true })
  }
  const wwwDir = resolve(appsDir, `${manifest.appid}/www`)
  cpSync(resolve(App.projectRoot, 'dist/dev/app'), wwwDir, { recursive: true })
  const gradleExePath = getGradleExePath()
  try {
    const { stderr } = await execa({
      stdio: 'inherit',
      env: { FORCE_COLOR: 'true' },
      cwd: AndroidDir,
    })`${gradleExePath} assembleDebug`
    if (stderr) {
      Log.error(`${Log.failSignal} Android打包出错了: ${stderr}`)
      return
    }
  } catch {
    Log.error(`${Log.failSignal} Android打包出错了`)
    return
  }
  const apkPath = `${AndroidPath}/app/build/outputs/apk/debug/app-debug.apk`
  Log.success(`${Log.successSignal} Android打包成功: ${apkPath}`)

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
    Log.debug(`安装 ${apkPath} 到设备 \`${deviceName}\``)
    const apkFullPath = resolve(App.projectRoot, apkPath)
    await android.install(deviceName, apkFullPath, { r: true })
    Log.success(`${Log.successSignal} 已成功安装 ${apkPath} 到设备 ${deviceName} 上`)
    Log.debug('开始拉起App')
    await android.adb(
      deviceName,
      `shell am start -n ${manifest['app-plus']?.distribute?.android?.packagename}/io.dcloud.PandoraEntry`,
    )
    // const proc = execa({ stdio: 'inherit' })`adb logcat console:D *:S -v raw -v color`
  } catch (error) {
    Log.error(`${Log.failSignal} 出错了: ${(error as Error).message}`)
  }
}
