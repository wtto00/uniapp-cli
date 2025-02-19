import { relative } from 'node:path'
import chokidar from 'chokidar'
import { type StdoutStderrOption, execa } from 'execa'
import type { WebSocket } from 'ws'
import { platformIsInstalled } from './platform-list.js'
import { buildAndroid } from './utils/build/index.js'
import { checkConfig } from './utils/check/index.js'
import { HMRServer, SocketMessage, startFileServer, startWebSocketServer, zipDir } from './utils/server.js'
import { initSignEnv } from './utils/sign.js'
import { devDistPath, hBuilderDistPath } from './utils/www.js'

export async function run(projectInfo: ProjectInfo, options: UniRunOptions) {
  const {
    utils: { platformNotInstalledMessage, transformPackageCommand, stripAnsiColors, uniRunSuccess },
    manifest,
  } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    throw Error(platformNotInstalledMessage('android'))
  }

  await initSignEnv(options)

  checkConfig(manifest)

  const args = ['uni', '-p', 'app-android']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)

  let over = false

  const stdoutTransform = function* (line: string) {
    yield line
    if (over) return

    const text = stripAnsiColors(line)
    if (uniRunSuccess(text)) {
      over = true
      runAndroid(projectInfo, options)
    }
  }

  // const stderrTransform = function* (line: string) {
  //   yield line
  // }

  await execa({
    stdout: options.open ? ([stdoutTransform, 'inherit'] as StdoutStderrOption) : 'inherit',
    stderr: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: false,
  })`${commands.command} ${commands.args}`
}

async function runAndroid(projectInfo: ProjectInfo, options: UniRunOptions) {
  const { manifest, Log } = projectInfo

  // 启动文件下载服务器
  const distDir = options.hxcli ? hBuilderDistPath : devDistPath
  await startFileServer(distDir)

  // 压缩打包结果
  await zipDir(distDir)

  // 启动websocket服务器
  let socketServer: WebSocket | null = null
  await startWebSocketServer((wss) => {
    socketServer = wss
    socketServer.send(SocketMessage.initial(manifest))
  })

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
    if (process.platform === 'win32') {
      filePath = filePath.replace(/\\/g, '/')
    }

    if (type === 'unlink') changedFiles.delete(filePath)
    else changedFiles.add(filePath)

    clearTimeout(watchClock)
    watchClock = setTimeout(async () => {
      if (changedFiles.size > 0) {
        socketServer?.send(SocketMessage.build(manifest, changedFiles), (err) => {
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

  await buildAndroid(projectInfo, {
    socketHost: HMRServer.getIp(),
    socketPort: HMRServer.webSocketPort,
  })
}
