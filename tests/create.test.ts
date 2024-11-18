import assert from 'node:assert'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { after, describe, it } from 'node:test'
import type { SyncResult } from 'execa'
import Log from '../src/utils/log.js'
import { execaUniapp, execaUniappSync } from './helper.js'

const HELP_TEXT = `Usage: uniapp create <project-name>

使用 uniapp-cli 创建新项目

Arguments:
  project-name               项目名称

Options:
  -t, --template <template>  新建项目的模板，是一个 Git 仓库地址
  -f, --force                如果目录已存在，强制覆盖
  -h, --help                 帮助信息

示例:
  uniapp create my-uniapp
  uniapp create my-uniapp -t dcloudio/uni-preset-vue#vite-ts --force
  uniapp create my-uniapp -t https://gitee.com/dcloudio/uni-preset-vue#vite-ts
  uniapp create my-uniapp -t git@gitee.com:dcloudio/uni-preset-vue#vite
`

const PROMPT_TEXT = `\x1B[34m?\x1B[39m \x1B[1m请选择新建项目的模板\x1B[22m \x1B[2m(Use arrow keys)\x1B[22m
\x1B[36m❯ vitesse\x1B[39m
  vue3-ts
  vue3
  vue2-ts
  vue2\x1B[?25l\x1B[7G
\x1B[?25h`

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

  it('none arguments', { timeout: 10000 }, async () => {
    await assert.rejects(() => execaUniapp('create'), `error: missing required argument 'project-name'\n\n${HELP_TEXT}`)
  })

  it('invalid project name', { timeout: 10000 }, async () => {
    await assert.rejects(
      () => execaUniapp('create 你好'),
      (err: SyncResult) => {
        assert.equal(
          err.stdout,
          `${Log.errorMessage('无效的项目名称: 你好\nError: name can only contain URL-friendly characters')}`,
        )
        return true
      },
    )
  })

  it('no template', { timeout: 10000 }, async () => {
    assert.throws(() => execaUniappSync('create test-project'), {
      stdout: PROMPT_TEXT,
    })
  })

  it('--template invalid repository', { timeout: 10000 }, async () => {
    await assert.rejects(
      () => execaUniapp('create test-project-invlide-repository --template xxxx'),
      "fatal: repository 'xxxx' does not exist",
    )
  })

  it('--template branch', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp('create test-project-branch --template dcloudio/uni-preset-vue#vite-ts')
    assert.equal(
      stdout,
      `${Log.warnMessage('正在使用自定义模板 dcloudio/uni-preset-vue#vite-ts，请确保拥有模板仓库的访问权限')}

运行以下命令开始吧:
  cd test-project-branch
  pnpm install
  uniapp run h5
`,
    )
  })

  it('--template tag', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-tag --template dcloudio/uni-preset-vue#3.0.0-4020920240930001',
    )
    assert.equal(
      stdout,
      `${Log.warnMessage('正在使用自定义模板 dcloudio/uni-preset-vue#3.0.0-4020920240930001，请确保拥有模板仓库的访问权限')}

运行以下命令开始吧:
  cd test-project-tag
  pnpm install
  uniapp run h5
`,
    )
  })

  it('no --force', { timeout: 10000 }, async () => {
    if (!existsSync('test-project-no-force')) mkdirSync('test-project-no-force')
    await assert.rejects(
      () => execaUniapp('create test-project-no-force --template dcloudio/uni-preset-vue'),
      (err: SyncResult) => {
        assert.equal(err.stdout, `${Log.errorMessage('test-project-no-force 已存在, 使用 `--force` 强制覆盖')}`)
        return true
      },
    )
  })

  it('--force --verbose .git', { timeout: 30000 }, async () => {
    if (!existsSync('test-project-force')) mkdirSync('test-project-force')
    const { stdout } = await execaUniapp('create test-project-force --template dcloudio/uni-preset-vue --force')
    assert(
      stdout,
      `${Log.warnMessage('正在使用自定义模板 dcloudio/uni-preset-vue，请确保拥有模板仓库的访问权限')}

运行以下命令开始吧:
  cd test-project-force
  pnpm install
  uniapp run h5
`,
    )
    assert.equal(existsSync('test-project-force/.git'), false)
    const content = readFileSync('test-project-force/package.json', 'utf8')
    assert.equal(JSON.parse(content).name, 'test-project-force')
  })

  it('-t https -d', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-https -t https://github.com/dcloudio/uni-preset-vue#vite-ts -d',
    )
    assert.match(
      stdout,
      /正在使用自定义模板 https:\/\/github.com\/dcloudio\/uni-preset-vue#vite-ts，请确保拥有模板仓库的访问权限/,
    )
    assert.match(stdout, /运行以下命令开始吧:/)
  })

  it('-t git', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp('create test-project-git -t git@github.com:dcloudio/uni-preset-vue#vite-ts')
    assert.match(
      stdout,
      /正在使用自定义模板 git@github\.com:dcloudio\/uni-preset-vue#vite-ts，请确保拥有模板仓库的访问权限/,
    )
    assert.match(stdout, /运行以下命令开始吧:/)
  })

  it('-t ssh', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-ssh -t ssh://git@github.com/dcloudio/uni-preset-vue#vite-ts',
    )
    assert.match(
      stdout,
      /正在使用自定义模板 ssh:\/\/git@github.com\/dcloudio\/uni-preset-vue#vite-ts，请确保拥有模板仓库的访问权限/,
    )
    assert.match(stdout, /运行以下命令开始吧:/)
  })

  it('-t gitee https', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp(
      'create test-project-https-gitee -t https://gitee.com/dcloud/uni-preset-vue#vite-ts',
    )
    assert.match(
      stdout,
      /正在使用自定义模板 https:\/\/gitee.com\/dcloud\/uni-preset-vue#vite-ts，请确保拥有模板仓库的访问权限/,
    )
    assert.match(stdout, /运行以下命令开始吧:/)
  })

  it('-t gitee git', { timeout: 30000 }, async () => {
    const { stdout } = await execaUniapp('create test-project-git-gitee -t git@gitee.com:dcloud/uni-preset-vue#vite-ts')
    assert.match(
      stdout,
      /正在使用自定义模板 git@gitee.com:dcloud\/uni-preset-vue#vite-ts，请确保拥有模板仓库的访问权限/,
    )
    assert.match(stdout, /运行以下命令开始吧:/)
  })
})
