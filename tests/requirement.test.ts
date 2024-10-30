import { after, before, describe, it } from 'node:test'
import { execaUniapp } from './helper'
import assert from 'node:assert'
import { rmSync } from 'node:fs'
import { execa } from 'execa'

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
      await execaUniapp('create test-project-requirement')
      process.chdir('test-project-requirement')
      execa`pnpm i`
    },
    { timeout: 60000 },
  )

  after(() => {
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
    assert.equal(stdout, 'h5: \n\x1B[32m✅ 平台 `h5` 已安装\x1B[39m\n')
  })

  it('h5 mp-weixin', { timeout: 10000, todo: true })

  it('mp-weixin', { timeout: 10000, todo: true })

  it('mp-weixin env', { timeout: 10000, todo: true })

  it('android', { timeout: 10000, todo: true })

  it('ios', { timeout: 10000, todo: true })

  it('harmony', { timeout: 10000, todo: true })
})
