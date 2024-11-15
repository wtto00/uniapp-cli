import assert from 'node:assert'
import { mkdirSync, writeFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import Log from '../src/utils/log.js'
import { execaUniapp, execaUniappSync } from './helper.js'

const HELP_TEXT = `Usage: uniapp transform <source> [target]

把一个HBuilderX创建的项目，转换为CLI创建的项目

Arguments:
  source       HBuilderX项目所在的目录位置
  target       转换后的CLI项目所在的目录位置。默认为当前目录+原项目目录名

Options:
  -f, --force  如果目录已存在，强制覆盖
  -h, --help   帮助信息

示例:
  uniapp transform project-by-hbuilderx project-by-cli
  uniapp transform project-by-hbuilderx`

const SUCESS_TEXT = `? 是否使用下面所列举的服务 (Press <space> to select, <a> to toggle all, <i> to
invert selection, and <enter> to proceed)
❯◯ sass
 ◯ pinia
 ◯ vue-i18n
 ◯ vue-router
 ◯ vuex
User force closed the prompt with 0 null`

describe('transform', () => {
  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help transform')
    assert.equal(stdout, HELP_TEXT)
  })

  it('source not exist', { timeout: 10000 }, async () => {
    await assert.rejects(() => execaUniapp('transform aaa'), '应用 aaa 不存在')
  })

  it('no target', { timeout: 10000 }, async () => {
    await assert.rejects(() => execaUniapp('transform templates'), {
      exitCode: 1,
      stdout: Log.errorColor('转换后的目录与原目录相同，请使用 `--force` 参数强制修改原项目'),
    })
  })

  it('no target --force', { timeout: 30000 }, async () => {
    assert.throws(() => execaUniappSync('transform templates -f'), SUCESS_TEXT)
  })

  it('target not empty', { timeout: 10000 }, async () => {
    await assert.rejects(() => execaUniapp('transform templates tests'), {
      exitCode: 1,
      stdout: Log.errorColor('目录 tests 非空，使用 `--force` 强制覆盖'),
    })
  })

  it('--force', { timeout: 30000 }, async () => {
    mkdirSync('test-project-transform')
    writeFileSync('test-project-transform/test', 'test', 'utf8')
    assert.throws(() => execaUniappSync('transform templates test-project-transform -f'), SUCESS_TEXT)
  })
})
