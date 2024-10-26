import { after, describe, it } from 'node:test'
import { execaUniapp, execaUniappSync } from './helper.js'
import assert from 'node:assert'
import type { SyncResult } from 'execa'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'

const HELP_TEXT = `Usage: uniapp create <project-name>

使用 uniapp_cli 创建新项目

Arguments:
  project-name               项目名称

Options:
  -t, --template <template>  新建项目的模板，是一个 Git 仓库地址
  -f, --force                如果目录已存在，强制覆盖
  -h, --help                 帮助信息

示例:
  uniapp create MyUniApp
  uniapp create MyUniApp -t dcloudio/uni-preset-vue#vite-ts --force
  uniapp create MyUniApp -t https://gitee.com/dcloudio/uni-preset-vue#vite-ts
  uniapp create MyUniApp -t git@gitee.com:dcloudio/uni-preset-vue#vite
`

describe('create', () => {
  after(() => {
    const testProjects = readdirSync('./')
    for (const dir of testProjects) {
      if (dir.startsWith('test-project')) {
        rmSync(dir, { force: true, recursive: true })
      }
    }
  })

  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help create')
    assert.equal(stdout, HELP_TEXT)
  })

  it('--help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('create --help')
    assert.equal(stdout, HELP_TEXT)
  })

  it('None arguments', { timeout: 10000 }, () => {
    assert.rejects(() => execaUniapp('create'), `error: missing required argument 'project-name'\n\n${HELP_TEXT}`)
  })

  it('Invalid project name', { timeout: 10000 }, () => {
    assert.rejects(
      () => execaUniapp('create 你好'),
      (err: SyncResult) => {
        assert.equal(
          err.stdout,
          `\u001b[31m无效的项目名称: 你好\u001b[39m
\u001b[31mError: name can only contain URL-friendly characters\u001b[39m`,
        )
        return true
      },
    )
  })

  it('create', { timeout: 10000 }, () => {
    assert.throws(
      () => execaUniappSync('create test-project'),
      `\x1B[34m?\x1B[39m \x1B[1m请选择新建项目的模板\x1B[22m \x1B[2m(Use arrow keys)\x1B[22m\n\x1B[36m❯ vitesse\x1B[39m
  vue3-ts
  vue3
  vue2
  vue3-alpha
  vue2-alpha\x1B[?25l\x1B[13G\n\x1B[?25h\x1B[31mUser force closed the prompt with 0 null\x1B[39m`,
    )
  })

  it('--template branch', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp('create test-project-branch --template dcloudio/uni-preset-vue#vite-ts')
    assert.equal(
      stdout,
      `
应用 \`test-project-branch\` 创建成功
运行下面的命令开始:
\tcd test-project-branch
\tpnpm i
\tuniapp run h5
`,
    )
  })

  it('--template tag', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-tag --template dcloudio/uni-preset-vue#3.0.0-4020920240930001',
    )
    assert.match(stdout, /应用 `test-project-tag` 创建成功/)
  })

  it('No --force', { timeout: 10000 }, () => {
    mkdirSync('test-project-no-force')
    assert.rejects(
      () => execaUniapp('create test-project-no-force --template dcloudio/uni-preset-vue'),
      (err: SyncResult) => {
        assert.equal(err.stdout, '\x1B[31m`test-project-no-force` 已存在, 使用 `--force` 强制覆盖。\x1B[39m')
        return true
      },
    )
  })

  it('--force --verbose .git', { timeout: 30000 }, async () => {
    mkdirSync('test-project-force')
    const { stdout } = await execaUniapp(
      'create test-project-force --template dcloudio/uni-preset-vue --force --verbose',
    )
    assert.match(stdout, /验证项目名称 test-project-force 是否有效/)
    assert.match(stdout, /项目名称 test-project-force 有效/)
    assert.match(stdout, /删除项目模板中的 .git 目录/)
    assert.match(stdout, /应用 `test-project-force` 创建成功/)
    const gitExist = existsSync('test-project-force/.git')
    assert.equal(gitExist, false)
  })

  it('-t https -d', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-https -t https://github.com/dcloudio/uni-preset-vue#vite-ts -d',
    )
    assert.match(stdout, /项目名称 test-project-https 有效/)
    assert.match(stdout, /应用 `test-project-https` 创建成功/)
  })

  it('-t git', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp('create test-project-git -t git@github.com:dcloudio/uni-preset-vue#vite-ts')
    assert.match(stdout, /应用 `test-project-git` 创建成功/)
  })

  it('-t ssh', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-ssh -t ssh://git@github.com/dcloudio/uni-preset-vue#vite-ts',
    )
    assert.match(stdout, /应用 `test-project-ssh` 创建成功/)
  })

  it('-t gitee https', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-https-gitee -t https://gitee.com/dcloud/uni-preset-vue#vite-ts',
    )
    assert.match(stdout, /应用 `test-project-https-gitee` 创建成功/)
  })

  it('-t gitee git', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp('create test-project-git-gitee -t git@gitee.com:dcloud/uni-preset-vue#vite-ts')
    assert.match(stdout, /应用 `test-project-git-gitee` 创建成功/)
  })
})
