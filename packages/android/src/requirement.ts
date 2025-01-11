import { resolve } from 'node:path'
import { sdkNotFoundMessage } from '@wtto00/uniapp-common//dist/error.js'
import { execa, whichPath } from '@wtto00/uniapp-common//dist/exec.js'
import { exists } from '@wtto00/uniapp-common/dist/file.js'
import Log from '@wtto00/uniapp-common/dist/log.js'

export async function requirement() {
  await checkJave()
  await checkAndroidSdk()
}

async function checkJave() {
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
