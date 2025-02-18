import {
  App,
  type RunOptions,
  type StdoutStderrOption,
  execa,
  notInstalledMessage,
  stripAnsiColors,
  transformPackageCommand,
  uniRunSuccess,
} from '@wtto00/uniapp-common'
import { platformIsInstalled } from './platform-list.js'
import { checkConfig } from './utils/check/index.js'
import { initSignEnv } from './utils/sign.js'

export async function run(options: RunOptions) {
  if (!(await platformIsInstalled())) {
    throw Error(notInstalledMessage('android'))
  }

  await initSignEnv(options)

  const manifest = await App.getManifestJson()
  checkConfig(manifest)

  const args = ['uni', '-p', 'app-android']
  if (options.mode) args.push('--mode', options.mode)
  const commands = await transformPackageCommand('execute-local', args)

  let over = false

  const stdoutTransform = function* (line: string) {
    yield line
    if (over) return

    const text = stripAnsiColors(line)
    if (uniRunSuccess(text)) over = true

    runAndroid(options)
  }

  // const stderrTransform = function* (line: string) {
  //   yield line
  // }

  await execa({
    stdout: options.open ? ([stdoutTransform, 'inherit'] as StdoutStderrOption) : 'inherit',
    stderr: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: false,
  })`${commands.command} ${commands.args}`
}

async function runAndroid(_options: RunOptions) {}
