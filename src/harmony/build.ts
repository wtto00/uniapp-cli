import type { BuildOptions, HarmonyBundle } from '../build.js'
import Log from '../utils/log.js'
import { clean } from './clean.js'
import { prepare } from './prepare.js'
import { hvigorwBuild, hvigorwSync } from './tools/hvigorw.js'
import { ohpmInstall } from './tools/ohpm.js'

export interface HarmonyBuildOptions {
  isBuild?: boolean
}

export async function buildHarmony(options: BuildOptions, runOptions?: HarmonyBuildOptions) {
  Log.info('执行 clean')
  await clean()

  Log.info('执行 prepare')
  await prepare({ isBuild: runOptions?.isBuild })

  Log.info('安装 Harmony 依赖')
  await ohpmInstall()

  Log.info('打包初始化')
  await hvigorwSync()

  Log.info('开始打包')
  await hvigorwBuild(options.bundle as HarmonyBundle)
}
