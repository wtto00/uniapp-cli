import assert from 'node:assert'
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { after, before, describe, it } from 'node:test'
import chalk from 'chalk'
import Log from '../src/utils/log.js'
import { isWindows } from '../src/utils/util.js'
import { execaUniapp } from './helper'

const HELP_TEXT = `Usage: uniapp requirements|requirement <platform...>

检查给定平台的环境要求

Arguments:
  platform    想要检查的平台: android,ios,h5,mp-weixin...

Options:
  -h, --help  帮助信息

示例:
  uniapp requirements android
  uniapp requirement h5 mp-weixin`

describe('requirement', () => {
  before(
    async () => {
      await execaUniapp('create test-project-requirement -t https://gitee.com/dcloud/uni-preset-vue#vite-ts')
      process.chdir('test-project-requirement')
    },
    { timeout: 60000 },
  )

  after(() => {
    process.chdir('..')
    rmSync('test-project-requirement', { force: true, recursive: true })
  })

  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help requirement')
    assert.equal(stdout, HELP_TEXT)
  })

  it('requirements --help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirements --help')
    assert.equal(stdout, HELP_TEXT)
  })

  it('none arguments', { timeout: 10000 }, async () => {
    await assert.rejects(
      () => execaUniapp('requirement'),
      `error: missing required argument 'platform'\n\n${HELP_TEXT}`,
    )
  })

  it('invalid platform', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement h5 xxx aaa android')
    assert.equal(
      stdout,
      `${Log.warnMessage('无效的平台: xxx')}
${Log.warnMessage('无效的平台: aaa')}

${chalk.cyan('h5:')}
${Log.successMessage('平台 h5 已安装')}

${chalk.cyan('android:')}
${Log.warnMessage('平台 android 还没有安装。请运行 `uniapp platform add android` 添加安装')}
`,
    )
  })

  it('h5', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement h5')
    assert.equal(stdout, `${chalk.cyan('h5:')}\n${Log.successMessage('平台 h5 已安装')}\n`)
  })

  it('mp-weixin', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement mp-weixin')
    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      assert.equal(
        stdout,
        `${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${Log.errorMessage(`微信开发者工具不支持系统: ${process.platform}`)}
`,
      )
      return
    }
    const defaultPath = isWindows()
      ? 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat'
      : '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
    const isInstall = existsSync(defaultPath)
    if (isInstall) {
      assert.equal(
        stdout,
        `${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${Log.successMessage(`微信开发者工具已安装 (${defaultPath})`)}
`,
      )
    } else {
      assert.equal(
        stdout,
        `${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${Log.warnMessage(`没有检测到微信开发者工具。如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置`)}
`,
      )
    }
  })

  it('mp-weixin env', { timeout: 10000 }, async () => {
    const cliName = `cli${isWindows() ? '.bat' : ''}`
    const cliPath = resolve(cliName)
    process.env.WEIXIN_DEV_TOOL = cliPath
    writeFileSync(cliPath, '', 'utf8')
    const { stdout } = await execaUniapp('requirement mp-weixin')
    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      assert.equal(
        stdout,
        `${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${Log.errorMessage(`微信开发者工具不支持系统: ${process.platform}`)}
`,
      )
      return
    }
    assert.equal(
      stdout,
      `${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${Log.successMessage(`微信开发者工具已安装 (${cliPath})`)}
`,
    )
    process.env.WEIXIN_DEV_TOOL = undefined
    rmSync(cliPath, { force: true, recursive: true })
  })

  it('h5 mp-weixin', { timeout: 10000 }, async () => {
    const defaultPath = isWindows()
      ? 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat'
      : '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
    const isInstall = existsSync(defaultPath)
    const { stdout } = await execaUniapp('requirement h5 mp-weixin')
    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      assert.equal(
        stdout,
        `${chalk.cyan('h5:')}
${Log.successMessage('平台 h5 已安装')}

${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${Log.errorMessage(`微信开发者工具不支持系统: ${process.platform}`)}
`,
      )
      return
    }
    assert.equal(
      stdout,
      `${chalk.cyan('h5:')}
${Log.successMessage('平台 h5 已安装')}

${chalk.cyan('mp-weixin:')}
${Log.successMessage('平台 mp-weixin 已安装')}
${
  isInstall
    ? `${Log.successMessage(`微信开发者工具已安装 (${defaultPath})`)}\n`
    : `${Log.warnMessage(`没有检测到微信开发者工具。如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置`)}
`
}`,
    )
  })

  it('android', { timeout: 10000, todo: true })
  it('ios', { timeout: 10000, todo: true })
  it('harmony', { timeout: 10000, todo: true })
  it('mp-alipay', { todo: true })
  it('mp-baidu', { todo: true })
  it('mp-toutiao', { todo: true })
  it('mp-lark', { todo: true })
  it('mp-qq', { todo: true })
  it('mp-kuaishou', { todo: true })
  it('mp-jd', { todo: true })
  it('mp-360', { todo: true })
  it('mp-xhs', { todo: true })
  it('quickapp-union', { todo: true })
  it('quickapp-huawei', { todo: true })
})
