import { join } from 'node:path'
import { execa } from 'execa'
import which from 'which'
import type { HarmonyBundle } from '../../build.js'
import { exists } from '../../utils/file.js'
import { HarmonyDir } from '../../utils/path.js'
import { Tools } from '../../utils/tool.js'
import { isDarwin, isWindows } from '../../utils/util.js'

export async function getHvigorw() {
  let hvigorwPath = await which('hvigorw', { nothrow: true })
  if (hvigorwPath && (await exists(hvigorwPath))) return hvigorwPath

  const hvigorwFileName = isWindows() ? 'hvigorw.bat' : 'hvigorw'
  if (process.env.HARMONY_HOME) {
    hvigorwPath = join(process.env.HARMONY_HOME, 'bin', hvigorwFileName)
    if (await exists(hvigorwPath)) return hvigorwPath
  }

  if (isWindows()) {
    if (process.env['DevEco Studio']) {
      hvigorwPath = join(process.env['DevEco Studio'], '..', 'tools', 'hvigor', 'bin', hvigorwFileName)
      if (await exists(hvigorwPath)) return hvigorwPath
    }
    if (process.env.ProgramFiles) {
      hvigorwPath = join(process.env.ProgramFiles, 'Huawei', 'DevEco Studio', 'tools', 'hvigor', 'bin', hvigorwFileName)
      if (await exists(hvigorwPath)) return hvigorwPath
    }
  } else if (isDarwin()) {
    hvigorwPath = `/Applications/DevEco-Studio.app/Contents/tools/hvigor/bin/${hvigorwFileName}`
    if (await exists(hvigorwPath)) return hvigorwPath
  }

  throw Error('未找到 hvigorw 可执行文件，请确认已安装 Harmony 命令行工具或者DevEco')
}

export async function hvigorwClean() {
  const hvigorw = await Tools.getHvigorw()
  return execa({ stdio: 'inherit', cwd: HarmonyDir })`${hvigorw} clean --no-daemon`
}

export async function hvigorwSync() {
  const hvigorw = await Tools.getHvigorw()
  return execa({
    cwd: HarmonyDir,
    stdio: 'inherit',
  })`${hvigorw} --sync -p product=default --analyze=normal --parallel --incremental --no-daemon`
}

export async function hvigorwBuild(bundle: HarmonyBundle) {
  const hvigorw = await Tools.getHvigorw()
  let cmd = 'assembleHap'
  const args = []
  // let args = ['assembleHap', '--mode', 'module', '-p', 'product=default', '-p', 'buildMode=debug', '--no-daemon']
  switch (bundle) {
    case 'har':
      cmd = 'assembleHar'
      args.push('--mode', 'module', '-p', 'module=library1@default')
      break
    case 'hsp':
      cmd = 'assembleHsp'
      args.push('--mode', 'module', '-p', 'module=library@default')
      break
    case 'app':
      cmd = 'assembleApp'
      args.push('--mode', 'project', '-p', 'buildMode=debug')
      break
    default:
      cmd = 'assembleHap'
      args.push('--mode', 'module', '-p', 'buildMode=debug')
      break
  }
  args.unshift(cmd)
  args.push('-p', 'product=default', '--no-daemon')
  return execa({ stdio: 'inherit', cwd: HarmonyDir })`${hvigorw} ${args}`
}
