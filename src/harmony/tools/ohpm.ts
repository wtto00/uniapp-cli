import { join } from 'node:path'
import { execa } from 'execa'
import which from 'which'
import { exists } from '../../utils/file.js'
import { HarmonyDir } from '../../utils/path.js'
import { Tools } from '../../utils/tool.js'
import { isDarwin, isWindows } from '../../utils/util.js'

export async function getOhpm() {
  let ohpmPath = await which('ohpm', { nothrow: true })
  if (ohpmPath && (await exists(ohpmPath))) return ohpmPath

  const ohpmFileName = isWindows() ? 'ohpm.bat' : 'ohpm'
  if (process.env.HARMONY_HOME) {
    ohpmPath = join(process.env.HARMONY_HOME, 'bin', ohpmFileName)
    if (await exists(ohpmPath)) return ohpmPath
  }

  if (isWindows()) {
    if (process.env['DevEco Studio']) {
      ohpmPath = join(process.env['DevEco Studio'], '..', 'tools', 'ohpm', 'bin', ohpmFileName)
      if (await exists(ohpmPath)) return ohpmPath
    }
    if (process.env.ProgramFiles) {
      ohpmPath = join(process.env.ProgramFiles, 'Huawei', 'DevEco Studio', 'tools', 'ohpm', 'bin', ohpmFileName)
      if (await exists(ohpmPath)) return ohpmPath
    }
  } else if (isDarwin()) {
    ohpmPath = `/Applications/DevEco-Studio.app/Contents/tools/ohpm/bin/${ohpmFileName}`
    if (await exists(ohpmPath)) return ohpmPath
  }

  throw Error('未找到 ohpm 可执行文件，请确定已安装 Harmony 命令行工具或者DevEco')
}

export async function ohpmInstall() {
  const ohpm = await Tools.getOhpm()
  return execa({ cwd: HarmonyDir, stdio: 'inherit' })`${ohpm} install --all`
}
