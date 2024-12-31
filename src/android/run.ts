import { relative } from 'node:path'
import chokidar from 'chokidar'
import type { WebSocket } from 'ws'
import type { RunOptions } from '../run.js'
import Log from '../utils/log.js'
import { HMRServer, SocketMessage, startFileServer, startWebSocketServer, zipDir } from '../utils/server.js'
import { isWindows } from '../utils/util.js'
import { type AndroidBuildOptions, buildAndroid } from './build.js'
import { buildDistPath, devDistPath, hBuilderDistPath } from './www.js'

export async function runAndroid(options: RunOptions, runOptions?: AndroidBuildOptions) {
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
