import { after, before, describe, it } from 'node:test'
import { execaUniapp } from './helper'
import assert from 'node:assert'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { Log } from '../src/utils/log.js'
import { isWindows } from '../src/utils/util.js'
import { dirname, resolve } from 'node:path'

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
    assert.equal(stdout, '\x1B[33m无效的平台: xxx\x1B[39m')
  })

  it('h5', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement h5')
    assert.equal(stdout, `h5: \n\x1B[32m${Log.successSignal} 平台 \`h5\` 已安装\x1B[39m\n`)
  })

  it('mp-weixin', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement mp-weixin')
    assert.equal(
      stdout,
      `mp-weixin: 
\x1B[32m✔ 平台 \`mp-weixin\` 已安装\x1B[39m
\x1B[33m✖ 微信开发者工具没有安装\x1B[39m
  如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置
`,
    )
  })

  it('mp-weixin env', { timeout: 10000 }, async () => {
    const cliName = `cli${isWindows() ? '.bat' : ''}`
    const cliPath = resolve(cliName)
    process.env.WEIXIN_DEV_TOOL = cliPath
    writeFileSync(cliPath, '', 'utf8')
    const { stdout } = await execaUniapp('requirement mp-weixin')
    assert.equal(
      stdout,
      `mp-weixin: 
\x1B[32m✔ 平台 \`mp-weixin\` 已安装\x1B[39m
\x1B[32m✔ 微信开发者工具已安装 (${cliPath})\x1B[39m
`,
    )
    process.env.WEIXIN_DEV_TOOL = undefined
    rmSync(cliPath, { force: true, recursive: true })
  })

  it('mp-weixin default cli path', { timeout: 10000, skip: isWindows() }, async () => {
    if (isWindows()) return
    const cliPath = resolve('/Applications/wechatwebdevtools.app/Contents/MacOS/cli')
    const cliExist = existsSync(cliPath)
    if (!cliExist) {
      mkdirSync(dirname(cliPath), { recursive: true })
      writeFileSync(cliPath, '', 'utf8')
    }
    const { stdout } = await execaUniapp('requirement mp-weixin')
    assert.equal(
      stdout,
      `mp-weixin: 
\x1B[32m✔ 平台 \`mp-weixin\` 已安装\x1B[39m
\x1B[32m✔ 微信开发者工具已安装 (${cliPath})\x1B[39m
`,
    )
    if (!cliExist) rmSync(cliPath, { force: true, recursive: true })
  })

  it('h5 mp-weixin', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('requirement h5 mp-weixin')
    assert.equal(
      stdout,
      `h5: 
\x1B[32m${Log.successSignal} 平台 \`h5\` 已安装\x1B[39m

mp-weixin: 
\x1B[32m✔ 平台 \`mp-weixin\` 已安装\x1B[39m
\x1B[33m✖ 微信开发者工具没有安装\x1B[39m
  如果已经安装，请设置环境变量 \`WEIXIN_DEV_TOOL\` 为 \`cli${isWindows() ? '.bat' : ''}\` 可执行文件的位置
`,
    )
  })

  it('android', { timeout: 10000, todo: true })

  it('ios', { timeout: 10000, todo: true })

  it('harmony', { timeout: 10000, todo: true })
})
