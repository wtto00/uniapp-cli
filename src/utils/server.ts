import http from 'node:http'
import os from 'node:os'
import send from 'send'
import { type Server, type WebSocket, WebSocketServer } from 'ws'
import { App } from './app.js'
import { errorMessage } from './error.js'
import Log from './log.js'

/**
 * 获取本机局域网的IPV4
 */
export function getIpAddress() {
  const ifaces = os.networkInterfaces()
  const ips: string[] = []
  for (const name in ifaces) {
    for (const net of ifaces[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address)
      }
    }
  }
  return ips
}

interface ISocketMessage {
  // mobile字段客户端传过来的
  mobile: {
    clientID: string
    name: string
    platform: string
    udid: string
    version: string
  }
  contents: {
    project: {
      // 5+ | Wap2App | UniApp | 其他（quickApps）
      type: string
      // 使用app.appID，而不是project.appID。
      // 这里的appID暂时没发现有用到
      appID?: string
    }
    fileinfo: [
      {
        // deleteFile | getFile | writeFile
        // 删除路径为: {rootPath}/apps/{app.appID}/www/{path}/{name}
        action: string
        path: string
        name: string
        // http://192.168.x.xxx/abc.js
        sourcePath: string
        // 保存文件的位置是否是全路径？
        // 全路径: {rootPath}/cache/{name}
        // 否则: {rootPath}/apps/{app.appID}/www/{path}/{name}
        // 全路径下载zip文件，客户端先删除www目录，然后解压zip到www目录
        // 否则下载对应文件，到对应位置覆盖
        fullPackage: boolean
        // refreashType=reload并且全路径的时候有用到。
        firstInstall: boolean
      },
    ]
    app: {
      // appid
      appID?: string
      // 暂时没发现有用到
      customBase: boolean
    }
    // restart | current | reload | debug
    // restart: 重新启动应用
    // reload: 刷新当前应用（这里常用）
    // current: 暂时不知道干啥的
    // debug: 应该是真机调试的作用
    refreashType: 'restart' | 'current' | 'reload' | 'debug'
    // 当refreashType=debug有用到
    debugPath: string
    // 暂时没发现有用到
    logStr: string
    // 当refreashType=current有用到。处理逻辑在LocalServer2.this.mNetMgr.processEvent(IMgr.MgrType.WindowMgr, 14, finalParam);
    associatePaths: string
  }
  returnValue: {
    // 103 为停止信号
    code: number
    // 暂时没发现有用到
    str: string
  }
}
/** @see https://github.com/wtto00/uniapp-cli/issues/89#issuecomment-2518131874 */
export const SocketMessage = {
  mobile: {} as ISocketMessage['mobile'],

  build(files: Set<string>) {
    const manifest = App.getManifestJson()

    const fileinfo = []
    for (const file of files) {
      fileinfo.push({
        action: 'getFile',
        path: '.',
        name: file,
        sourcePath: `http://${HMRServer.getIp()}:${HMRServer.fileServerPort}/${file}`,
        fullPackage: false,
        firstInstall: false,
      })
    }

    return JSON.stringify({
      mobile: SocketMessage.mobile,
      contents: {
        project: {
          type: 'UniApp',
          appID: manifest.appid,
        },
        fileinfo,
        app: {
          appID: manifest.appid,
          customBase: false,
        },
        refreashType: 'reload',
      },
    })
  },
}

export const HMRServer = {
  webSocketPort: 30229,
  fileServerPort: 30329,
  ip: '',

  getIp() {
    if (!HMRServer.ip) HMRServer.ip = getIpAddress()[0]
    return HMRServer.ip
  },
}

export async function startWebSocketServer(callback: (ws: WebSocket) => void) {
  return new Promise<Server>((resolve, reject) => {
    const NetIP = HMRServer.getIp()
    if (!NetIP) return reject(Error('没有获取到本机局域网IP'))

    const options = { host: NetIP, port: HMRServer.webSocketPort }
    const wss = new WebSocketServer(options)
    wss.on('listening', () => {
      Log.debug('HMR已启动: ')
      resolve(wss)
      wss.on('message', (message) => {
        Log.debug(`HMR服务接收到消息: ${message}`)
        try {
          const data = JSON.parse(message.toString())
          SocketMessage.mobile = data.mobile
        } catch (error) {
          Log.debug(`解析HMR消息失败: ${errorMessage(error)}`)
        }
      })
    })
    wss.on('connection', (ws) => {
      Log.debug('客户端已连接HMR服务')
      callback(ws)
    })
    wss.on('error', reject)
    wss.on('close', () => {
      Log.debug('HMR服务已关闭')
      process.off('exit', wss.close)
    })

    process.on('exit', wss.close)
  })
}

export async function startFileServer(dir: string) {
  return new Promise<http.Server>((resolve, reject) => {
    const server = http
      .createServer((req, res) => {
        send(req, req.url ?? '', { root: dir }).pipe(res)
      })
      .listen(HMRServer.fileServerPort)
      .on('listening', () => {
        Log.debug('HMR文件服务已启动')
        resolve(server)
      })
      .on('error', reject)
      .on('close', () => {
        Log.debug('HMR文件服务已关闭')
        process.off('beforeExit', server.close)
      })
    process.on('beforeExit', server.close)
  })
}
