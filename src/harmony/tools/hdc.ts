import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import which from 'which'
import { exists } from '../../utils/file.js'
import { isDarwin, isWindows } from '../../utils/util.js'

export async function getHdc() {
  let hdcPath = await which('hdc', { nothrow: true })
  if (hdcPath && (await exists(hdcPath))) return hdcPath

  const hdcFileName = isWindows() ? 'hdc.exe' : 'hdc'

  if (process.env.HARMONY_HOME) {
    hdcPath = join(process.env.HARMONY_HOME, 'sdk', 'default', 'openharmony', 'toolchains', hdcFileName)
    if (await exists(hdcPath)) return hdcPath
  }

  if (isWindows()) {
    if (process.env['DevEco Studio']) {
      hdcPath = join(process.env['DevEco Studio'], '..', 'sdk', 'default', 'openharmony', 'toolchains', hdcFileName)
      if (await exists(hdcPath)) return hdcPath
    }
    if (process.env.ProgramFiles) {
      hdcPath = join(
        process.env.ProgramFiles,
        'Huawei',
        'DevEco Studio',
        'sdk',
        'default',
        'openharmony',
        'toolchains',
        hdcFileName,
      )
      if (await exists(hdcPath)) return hdcPath
    }
    if (process.env.LOCALAPPDATA) {
      const sdkDir = join(process.env.LOCALAPPDATA, 'OpenHarmony', 'Sdk')
      if (await exists(sdkDir)) {
        const sdkVerions = (await readdir(sdkDir)).map((file) => Number(file)).filter((ver) => !Number.isNaN(ver))
        if (sdkVerions.length > 0) {
          const maxSdkVersion = Math.max(...sdkVerions)
          hdcPath = join(sdkDir, `${maxSdkVersion}`, 'toolchains', hdcFileName)
          if (await exists(hdcPath)) return hdcPath
        }
      }
    }
  } else if (isDarwin()) {
    hdcPath = `/Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/toolchains/${hdcFileName}`
    if (await exists(hdcPath)) return hdcPath
  }

  throw Error('未找到 hdc 可执行文件，请确认已安装 Harmony SDK')
}
