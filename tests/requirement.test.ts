import assert from 'node:assert'
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { after, before, describe, it } from 'node:test'
import Log from '../src/utils/log.js'
import { isWindows } from '../src/utils/util.js'
import { execaUniapp } from './helper'

const HELP_TEXT = `Usage: uniapp requirements|requirement <platform ...>

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
    assert.rejects(() => execaUniapp('requirement'), `error: missing required argument 'platform'\n\n${HELP_TEXT}`)
  })

  it('invalid platform', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement xxx')
    assert.equal(stdout, Log.warnColor('无效的平台: xxx'))
  })

  it('h5', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement h5')
    assert.equal(stdout, `h5: \n${Log.successColor(`${Log.successSignal} 平台 \`h5\` 已安装`)}\n`)
  })

  it('mp-weixin', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement mp-weixin')
    if (process.platform !== 'win32' && process.platform !== 'darwin') {
      assert.equal(
        stdout,
        `mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${Log.errorColor(`${Log.failSignal} 微信开发者平台不支持平台: ${process.platform}`)}
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
        `mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${Log.successColor(`${Log.successSignal} 微信开发者工具已安装 (${defaultPath})`)}
`,
      )
    } else {
      assert.equal(
        stdout,
        `mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${Log.warnColor(`${Log.failSignal} 微信开发者工具没有安装`)}
  如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置
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
        `mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${Log.errorColor(`${Log.failSignal} 微信开发者平台不支持平台: ${process.platform}`)}
`,
      )
      return
    }
    assert.equal(
      stdout,
      `mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${Log.successColor(`${Log.successSignal} 微信开发者工具已安装 (${cliPath})`)}
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
        `h5: 
${Log.successColor(`${Log.successSignal} 平台 \`h5\` 已安装`)}

mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${Log.errorColor(`${Log.failSignal} 微信开发者平台不支持平台: ${process.platform}`)}
`,
      )
      return
    }
    assert.equal(
      stdout,
      `h5: 
${Log.successColor(`${Log.successSignal} 平台 \`h5\` 已安装`)}

mp-weixin: 
${Log.successColor(`${Log.successSignal} 平台 \`mp-weixin\` 已安装`)}
${
  isInstall
    ? `${Log.successColor(`${Log.successSignal} 微信开发者工具已安装 (${defaultPath})`)}\n`
    : `${Log.warnColor(`${Log.failSignal} 微信开发者工具没有安装`)}
  如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置
`
}`,
    )
  })

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
