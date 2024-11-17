import assert from 'node:assert'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { after, before, describe, it } from 'node:test'
import Log from '../src/utils/log.js'
import { execaUniapp, execaUniappSync } from './helper.js'

const HELP_TEXT = `Usage: uniapp transform <source> [target]

把一个HBuilderX创建的项目，转换为CLI创建的项目

Arguments:
  source       HBuilderX项目所在的目录位置
  target       转换后的CLI项目所在的目录位置。默认为当前目录+原项目名称

Options:
  -f, --force  如果目录已存在，强制覆盖
  -h, --help   帮助信息

示例:
  uniapp transform project-by-hbuilderx project-by-cli
  uniapp transform project-by-hbuilderx`

const SUCESS_TEXT = `\x1B[34m?\x1B[39m \x1B[1m是否使用以下所列举的服务?\x1B[22m (Press \x1B[36m\x1B[1m<space>\x1B[22m\x1B[39m to select, \x1B[36m\x1B[1m<a>\x1B[22m\x1B[39m to toggle all, \x1B[36m\x1B[1m<i>\x1B[22m\x1B[39m to
invert selection, and \x1B[36m\x1B[1m<enter>\x1B[22m\x1B[39m to proceed)
\x1B[36m❯◯ sass\x1B[39m
 ◯ pinia
 ◯ vue-i18n
 ◯ vue-router
 ◯ vuex\x1B[?25l\x1B[8G
\x1B[?25h\x1B[31m\x1B[31m✖️\x1B[39m\x1B[31m User force closed the prompt with 0 null\x1B[39m`

const projectPath = 'test-project-transform'

describe('transform', () => {
  before(() => {
    if (!existsSync(projectPath)) mkdirSync(projectPath)
  })

  after(() => {
    rmSync(projectPath, { force: true, recursive: true })
  })

  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help transform')
    assert.equal(stdout, HELP_TEXT)
  })

  it('source not exist', { timeout: 10000 }, async () => {
    await assert.rejects(() => execaUniapp('transform aaa'), { stdout: Log.errorMessage('应用 aaa 不存在') })
  })

  it('no manifest', { timeout: 10000 }, async () => {
    await assert.rejects(() => execaUniapp(`transform ${projectPath}`), {
      stdout: Log.errorMessage(`文件 manifest.json 不存在，目录 ${projectPath} 不是一个 uniapp 项目`),
    })
  })

  it('no pages', { timeout: 10000 }, async () => {
    writeFileSync(`${projectPath}/manifest.json`, '', 'utf8')
    await assert.rejects(() => execaUniapp(`transform ${projectPath}`), {
      stdout: Log.errorMessage(`文件 pages.json 不存在，目录 ${projectPath} 不是一个 uniapp 项目`),
    })
  })

  it('no main', { timeout: 10000 }, async () => {
    writeFileSync(`${projectPath}/pages.json`, '', 'utf8')
    await assert.rejects(() => execaUniapp(`transform ${projectPath}`), {
      stdout: Log.errorMessage(`文件 main.js 不存在，目录 ${projectPath} 不是一个 uniapp 项目`),
    })
  })

  it('no target', { timeout: 10000 }, async () => {
    writeFileSync(`${projectPath}/main.js`, '', 'utf8')
    await assert.rejects(() => execaUniapp(`transform ${projectPath}`), {
      exitCode: 1,
      stdout: `没有设定CLI项目位置，默认选择目录 ${projectPath}
${Log.errorMessage(`目录 ${projectPath} 非空，请使用 \`--force\` 强制覆盖`)}`,
    })
  })

  it('no target --force', { timeout: 30000 }, async () => {
    assert.throws(() => execaUniappSync(`transform ${projectPath} -f`), {
      stdout: `没有设定CLI项目位置，默认选择目录 test-project-transform
${SUCESS_TEXT}`,
    })
  })

  const targetDir = 'test-project-transform-target'

  it('target exist', { timeout: 10000 }, async () => {
    if (!existsSync(targetDir)) mkdirSync(targetDir)
    writeFileSync(`${targetDir}/main.js`, '', 'utf8')
    await assert.rejects(() => execaUniapp(`transform ${projectPath} ${targetDir}`), {
      exitCode: 1,
      stdout: Log.errorMessage(`目录 ${targetDir} 非空，请使用 \`--force\` 强制覆盖`),
    })
  })

  it('--force', { timeout: 30000 }, async () => {
    assert.throws(() => execaUniappSync(`transform ${projectPath} ${targetDir} -f`), { stdout: SUCESS_TEXT })
  })
})
