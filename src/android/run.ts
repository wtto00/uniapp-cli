import { relative, resolve } from 'node:path'
import Android from '@wtto00/android-tools'
import chokidar from 'chokidar'
import { type ResultPromise, execa } from 'execa'
import ora from 'ora'
import type { WebSocket } from 'ws'
import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { errorDebugLog, errorMessage } from '../utils/error.js'
import Log from '../utils/log.js'
import { AndroidDir, AndroidPath } from '../utils/path.js'
import { HMRServer, SocketMessage, startFileServer, startWebSocketServer, zipDir } from '../utils/server.js'
import { isWindows } from '../utils/util.js'
import { cleanAndroid } from './clean.js'
import { getGradleExePath } from './gradle.js'
import { prepare } from './prepare.js'
import { buildDistPath, devDistPath, hBuilderDistPath } from './www.js'

let logcatProcess: ResultPromise<{
  stdout: 'inherit'
  stderr: 'ignore'
  buffer: false
  reject: false
}>

function killLogcat() {
  if (logcatProcess && !logcatProcess.killed) {
    logcatProcess.kill()
  }
}

export interface AndroidRunOptions {
  isBuild?: boolean
  isHbuilderX?: boolean
  socket?: {
    host: string
    port: number
  }
}

export async function buildAndroid(options: BuildOptions, runOptions?: AndroidRunOptions) {
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
      logcatProcess = execa({
        stdout: 'inherit',
        stderr: 'ignore',
        buffer: false,
        reject: false,
      })`${android.adbBin} -s ${deviceName} logcat console:D jsLog:D weex:E aaa:D *:S -v raw -v color -v time`
    }
  } catch (error) {
    Log.error(`出错了: ${errorMessage(error)}`)
    killLogcat()
  }
}

export async function runAndroid(options: RunOptions, runOptions?: AndroidRunOptions) {
  let ws: WebSocket | null = null
  const runOpts = { ...runOptions }
  // 启动文件下载服务器
  const distDir = runOpts.isHbuilderX ? hBuilderDistPath : runOpts.isBuild ? buildDistPath : devDistPath
  await startFileServer(distDir)

  // 压缩打包结果
  await zipDir(distDir)

  // 启动websocket服务器
  await startWebSocketServer((_ws) => {
    ws = _ws
    ws.send(SocketMessage.initial())
  })
  runOpts.socket = {
    host: HMRServer.getIp(),
    port: HMRServer.webSocketPort,
  }

  // 监听文件变化
  const watcher = chokidar.watch(distDir, {
    persistent: true,
    interval: 1000,
    binaryInterval: 1500,
    usePolling: true,
    ignoreInitial: true,
    ignorePermissionErrors: true,
    awaitWriteFinish: true,
  })
  let watchClock: NodeJS.Timeout
  const changedFiles = new Set<string>()
  const reload = (type: string, path: string) => {
    let filePath = relative(distDir, path)
    if (isWindows()) {
      filePath = filePath.replace(/\\/g, '/')
    }

    if (type === 'unlink') changedFiles.delete(filePath)
    else changedFiles.add(filePath)

    clearTimeout(watchClock)
    watchClock = setTimeout(() => {
      if (changedFiles.size > 0) {
        ws?.send(SocketMessage.build(changedFiles), (err) => {
          if (!err) {
            Log.debug('HMR热更新指令发送成功')
          }
        })
      }
    }, 1000)
  }
  watcher
    .on('add', (path) => reload('add', path))
    .on('change', (path) => reload('change', path))
    .on('unlink', (path) => reload('unlink', path))

  await buildAndroid(options, runOpts)
}
