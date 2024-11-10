import assert from 'node:assert'
import { describe, it } from 'node:test'
import { execaUniapp } from './helper.js'

const HELP_TEXT = `Usage: uniapp <command> [options]

Options:
  -v, --version                           uniapp_cli 的版本号
  -d, --verbose                           调试模式，输出 debug 级别的日志信息
  -h, --help                              帮助信息

Commands:
  create [options] <project-name>         创建新项目
  requirements|requirement <platform...>  检查给定平台的环境要求
  platform                                管理应用的平台
  run [options] <platform>                开始运行给定的平台
  build [options] <platform>              打包给定的平台
  transform <source> [target]             转换HBuilderX项目到CLI项目
  help [command]                          display help for command`

describe('help', async () => {
  it('--help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('--help')
    assert.strictEqual(stdout, HELP_TEXT)
  })

  it('-h', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('--help')
    assert.strictEqual(stdout, HELP_TEXT)
  })

  it('None arguments', { timeout: 10000 }, () => {
    assert.rejects(() => execaUniapp(''), HELP_TEXT)
  })
})

describe('error', () => {
  it('Unknown command', { timeout: 10000 }, () => {
    assert.rejects(() => execaUniapp('xxx'), `error: unknown command 'xxx'\n\n${HELP_TEXT}`)
  })
})
