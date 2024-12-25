import { access } from 'node:fs/promises'
import { basename, join } from 'node:path'
import chokidar from 'chokidar'
import { type ResultPromise, execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import { runAndroid } from '../android/run.js'
import type { RunOptions } from '../run.js'
import { App } from './app.js'
import { stripAnsiColors } from './exec.js'
import Log from './log.js'

export async function getHBuilderXCli(hxcli: string | boolean): Promise<string> {
  if (hxcli === false) return ''
  const useEnv = hxcli === true || !hxcli.trim()
  const hxcliPath = useEnv ? process.env.HBUILDERX_CLI : hxcli
  if (!hxcliPath) return Promise.reject(Error('未设置HBuilderX的cli可执行文件位置'))
  try {
    await access(hxcliPath)
    return hxcliPath
  } catch {
    return Promise.reject(Error(`设置的HBuilderX的cli可执行文件位置不存在: ${hxcliPath}`))
  }
}

type HBuilderBuildProcess = ResultPromise<{
  stdout: 'inherit' | (GeneratorTransform<false> | 'inherit')[]
  stderr: 'inherit'
  env: {
    FORCE_COLOR: string
  }
  reject: false
}>

/**
 * 使用HBuilderX的cli生成本地打包App资源
 * @see https://hx.dcloud.net.cn/cli/publish-app-appResource
 */
export async function runHXCli(options: RunOptions) {
  const hxcli = await getHBuilderXCli(options.hxcli)

  const projectName = basename(App.projectRoot)

  let proc: HBuilderBuildProcess | null = null
  let over = false

  const outTransform = function* (line: string) {
    yield line
    if (over) return
    const text = stripAnsiColors(line)
    if (text.includes(`项目 ${projectName} 导出成功，路径为：`)) {
      over = true
      runAndroid(options, { isHbuilderX: true })
    }
  } as GeneratorTransform<false>

  // 监听src目录，如果变动，则执行build
  const watchDir = join(App.projectRoot, 'src')
  const watcher = chokidar.watch(watchDir, {
    persistent: true,
    interval: 1000,
    binaryInterval: 1500,
    usePolling: true,
    ignorePermissionErrors: true,
    awaitWriteFinish: true,
  })
  let watchClock: NodeJS.Timeout
  const reload = () => {
    clearTimeout(watchClock)
    watchClock = setTimeout(() => {
      if (proc && !proc.killed) proc.kill()
      prepareHXProject({ open: options.open, hxcli }).then(() => {
        Log.debug('开始使用HBuilderX的cli打包')
        proc = execa({
          stdout: options.open ? [outTransform, 'inherit'] : 'inherit',
          stderr: 'inherit',
          env: { FORCE_COLOR: 'true' },
          reject: false,
        })`${hxcli} publish --platform APP --type appResource --project ${App.projectRoot}`
      })
    }, 1000)
  }
  watcher.on('add', reload).on('change', reload).on('unlink', reload)
}

async function prepareHXProject(options: {
  open?: boolean
  hxcli: string
}) {
  Log.debug('开始打开HBuilderX')
  const openOut = await execa`${options.hxcli} open`
  if (openOut.stderr) {
    Log.error(`打开HBuilderX出错了: ${openOut.stderr}`)
  }

  Log.debug(`开始使用HBuilderX的cli打开项目: ${App.projectRoot}`)
  const openProjectOut = await execa`${options.hxcli} project open --path ${App.projectRoot}`
  if (openProjectOut.stderr) {
    Log.error(`打开HBuilderX出错了: ${openProjectOut.stderr}`)
  }

  // 等待HBuilderX索引到项目
  await new Promise((resolve) => setTimeout(resolve, 3000))
}
