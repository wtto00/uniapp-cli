import { resolve } from 'node:path'
import { execa } from 'execa'
import { platformIsInstalled } from './platform-list.js'
import { sdkNotFoundMessage } from './utils/error.js'
import { whichPath } from './utils/exec.js'
import { exists } from './utils/file.js'

export async function requirement(projectInfo: ProjectInfo) {
  const { Log } = projectInfo

  if (!(await platformIsInstalled(projectInfo))) {
    Log.warn('平台 android 还没有安装。请运行 `uniapp platform add android` 添加安装')
  } else {
    Log.success('平台 android 已安装')
  }
  await checkJava(projectInfo)
  await checkAndroidSdk(projectInfo)
}

async function checkJava(projectInfo: ProjectInfo) {
  const { Log } = projectInfo

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

async function checkAndroidSdk(projectInfo: ProjectInfo) {
  const { Log } = projectInfo

  if (process.env.ANDROID_HOME) {
    Log.success(`ANDROID_HOME=${process.env.ANDROID_HOME}`)
  } else {
    Log.warn('没有设置环境变量: `ANDROID_HOME`')
  }
}
