import { resolve } from 'node:path'
import { Log, sdkNotFoundMessage } from '@wtto00/uniapp-common'
import { execa, whichPath } from '@wtto00/uniapp-common'
import { exists } from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'

export async function requirement() {
  if (!(await platformIsInstalled())) {
    Log.warn('平台 android 还没有安装。请运行 `uniapp platform add android` 添加安装')
  } else {
    Log.success('平台 android 已安装')
  }
  await checkJava()
  await checkAndroidSdk()
}

async function checkJava() {
  let javaBinPath = ''
  if (process.env.JAVA_HOME) {
    javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === 'win32' ? '.exe' : ''}`)
    if (!(await exists(javaBinPath))) javaBinPath = ''
  } else {
    javaBinPath = await whichPath('java')
  }
  if (!javaBinPath) return Log.warn(sdkNotFoundMessage('java', 'JDK'))
  const { stderr, stdout } = await execa`${javaBinPath} -version`
  const raw = (stdout || stderr).split('\n')[0]
  if (raw.includes(' version ')) {
    Log.success(`${raw}`)
  } else {
    Log.warn('检测 Java 版本失败了')
  }
}

async function checkAndroidSdk() {
  if (process.env.ANDROID_HOME) {
    Log.success(`ANDROID_HOME=${process.env.ANDROID_HOME}`)
  } else {
    Log.warn('没有设置环境变量: `ANDROID_HOME`')
  }
}
