import { join } from 'node:path'
import { select } from '@inquirer/prompts'
import Android from '@wtto00/android-tools'
import { execa } from 'execa'
import ora from 'ora'
import { projectDir } from '../const.js'
import { prepare } from '../prepare/index.js'
import { cleanAndroid } from './clean.js'
import { execGradleCommand } from './gradle.js'

type CommenOptions = Pick<UniRunOptions, 'device'>

interface DevOptions extends CommenOptions {
  isBuild?: false
  /** HMR服务socket地址 */
  socketHost: string
  socketPort: number
}
interface BuildOptions extends CommenOptions {
  isBuild: true
  bundle?: 'aab' | 'apk' | 'wgt'
}

export async function buildAndroid(projectInfo: ProjectInfo, options: DevOptions | BuildOptions) {
  const {
    root,
    Log,
    manifest,
    utils: { errorDebugLog },
  } = projectInfo

  Log.debug('清理 Android 资源')
  cleanAndroid(projectInfo)

  Log.info('准备 Android 打包所需资源')
  await prepare({ isBuild: options.isBuild })

  Log.info('开始 Android 打包')
  // const gradleExeCmd = getGradleExeCmd()
  let argv = 'assembleDebug'
  if (options.isBuild) {
    if (options.bundle === 'aab') argv = 'bundleRelease'
    else argv = 'assembleRelease'
  }
  try {
    await execGradleCommand(projectInfo, argv)
  } catch (error) {
    errorDebugLog(error)
    throw Error('Android 打包出错了')
  }

  let apkPath = `${projectDir}/app/build/outputs`
  if (options?.isBuild) {
    if (options.bundle === 'aab') {
      apkPath += '/bundle/release/app-release.aab'
    } else {
      apkPath += '/apk/release/app-release.apk'
    }
  } else {
    apkPath += '/apk/debug/app-debug.apk'
  }
  Log.success(`Android打包成功: ${apkPath}`)

  Log.debug('查找已连接设备')
  const android = new Android()
  const allDevices = await android.devices()
  const devices = allDevices.filter((item) => item.status === 'device')
  if (devices.length === 0) {
    throw Error('没有已连接的设备')
  }
  if (options.device && !devices.find((item) => item.name === options.device)) {
    throw Error(`设备: ${options.device} 没有连接`)
  }
  let deviceName = options.device
  if (!deviceName) {
    if (devices.length === 1) {
      deviceName = devices[0].name
    } else {
      deviceName = await select<string>({
        message: '请选择要启动的设备',
        choices: devices.map((d) => d.name),
        default: 0,
      })
    }
  }
  const packagename = manifest['app-plus']?.distribute?.android?.packagename ?? ''
  const spinner = ora(`安装 ${apkPath} 到设备 \`${deviceName}\``).start()
  try {
    const apkFullPath = join(root, apkPath)
    await android.install(deviceName, apkFullPath, { r: true })
    spinner.succeed(`已成功安装 ${apkPath} 到设备 ${deviceName} 上`)
  } catch (error) {
    spinner.fail('apk安装失败')
    errorDebugLog(error)
    throw error
  }
  Log.debug('开始拉起App')
  if (options.isBuild) {
    // build
    await android.adb(deviceName, `shell am start -n ${packagename}/io.dcloud.PandoraEntry`)
    return
  }

  // logcat
  await android.adb(deviceName, 'logcat -c')
  await execa({
    stdout: 'inherit',
    stderr: 'ignore',
    buffer: false,
    reject: false,
  })`${android.adbBin} -s ${deviceName} logcat console:D jsLog:D weex:E aaa:D *:S -v raw -v color -v time`

  const command = `shell am start -n ${packagename}/io.dcloud.debug.PullDebugActivity --es appid ${manifest.appid} --es ip ${options.socketHost} --es port ${options.socketPort}`
  await android.adb(deviceName, command)
}
