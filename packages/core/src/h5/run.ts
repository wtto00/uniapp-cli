import {
  Log,
  type StdoutStderrOption,
  execa,
  stripAnsiColors,
  transformPackageCommand,
  uniRunSuccess,
} from '@wtto00/uniapp-common'
import open from 'open'
import { platformIsInstalled } from './platform-list.js'

export async function run(option: { open: boolean; mode?: string }) {
  if (!(await platformIsInstalled())) {
    throw Error('平台 h5 还没有安装。 运行 `uniapp platform add h5` 添加')
  }

  const args = ['uni']
  if (option.mode) args.push('--mode', option.mode)
  const commands = await transformPackageCommand('execute-local', args)

  let url = ''
  let over = false

  const stdoutTransform = function* (line: string) {
    yield line
    if (over && url) return

    const text = stripAnsiColors(line)
    if (!url) {
      const matched = text.match(/Local:\s+(http:\/\/localhost:\d+)\//)
      if (matched?.[1]) url = matched[1]
    }
    if (!over && uniRunSuccess(text)) over = true

    if (!over || !url) return

    open(url)
      .then(() => {
        Log.success(`浏览器已打开: ${url}`)
      })
      .catch((error) => {
        Log.error(`浏览器打开失败 ${error.message}`)
      })
  }

  await execa({
    stdout: option.open ? ([stdoutTransform, 'inherit'] as StdoutStderrOption) : 'inherit',
    stderr: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: false,
  })`${commands.command} ${commands.args}`
}
