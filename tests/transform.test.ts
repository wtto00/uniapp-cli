import assert from 'node:assert'
import { describe, it } from 'node:test'
import { execaUniapp } from './helper.js'

const HELP_TEXT = `Usage: uniapp transform <source> [target]

把一个HBuilderX创建的项目，转换为CLI创建的项目

Arguments:
  source      HBuilderX项目所在的目录位置
  target      转换后的CLI项目所在的目录位置。默认为当前目录+原项目目录名

Options:
  -h, --help  帮助信息

示例:
  uniapp transform project-by-hbuilderx project-by-cli
  uniapp transform project-by-hbuilderx`

describe('transform', () => {
  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help transform')
    assert.equal(stdout, HELP_TEXT)
  })
})
