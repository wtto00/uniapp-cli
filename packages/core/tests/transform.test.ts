import assert from 'node:assert'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { after, before, describe, it } from 'node:test'
import type { PackageJson } from 'pkg-types'
import type ts from 'typescript'
import { readJsonFile } from '../src/utils/file.js'
import Log from '../src/utils/log.js'
import { execaUniapp, execaUniappSync } from './helper.js'

const HELP_TEXT = `Usage: uniapp transform <source> [target]

把一个HBuilderX创建的项目，转换为CLI创建的项目

Arguments:
  source                HBuilderX项目所在的目录位置
  target                转换后的CLI项目所在的目录位置。默认为当前目录+原项目名称

Options:
  -f, --force           如果目录已存在，强制覆盖
  --module [module...]  使用了哪些HBuilderX内置的模块: sass,pinia,i18n,vuex,router
  -h, --help            帮助信息

示例:
  uniapp transform project-by-hbuilderx project-by-cli
  uniapp transform project-by-hbuilderx -f --module sass pinia`

const PROMPT_TEXT = `\x1B[34m?\x1B[39m \x1B[1m是否使用以下所列举的服务?\x1B[22m (Press \x1B[36m\x1B[1m<space>\x1B[22m\x1B[39m to select, \x1B[36m\x1B[1m<a>\x1B[22m\x1B[39m to toggle all, \x1B[36m\x1B[1m<i>\x1B[22m\x1B[39m to
invert selection, and \x1B[36m\x1B[1m<enter>\x1B[22m\x1B[39m to proceed)
\x1B[36m❯◯ sass\x1B[39m
 ◯ pinia
 ◯ i18n
 ◯ vuex
 ◯ router\x1B[?25l\x1B[10G
\x1B[?25h`

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
    writeFileSync(`${projectPath}/manifest.json`, '{}', 'utf8')
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
      stdout: `没有设定CLI项目位置，默认选择目录 test-project-transform\n${PROMPT_TEXT}`,
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

  it('--force', { timeout: 10000 }, async () => {
    assert.throws(() => execaUniappSync(`transform ${projectPath} ${targetDir} -f`), {
      stdout: PROMPT_TEXT,
    })
  })

  it('jsconfig', { timeout: 10000 }, async () => {
    writeFileSync(
      `${projectPath}/jsconfig.json`,
      JSON.stringify({
        compilerOptions: { paths: { '@/common/*': ['./common/*'] } },
        exclude: ['node_modules', 'unpackage', 'example', './jquery/', '/.prettier'],
        include: ['pages', '/assets', './static', 'eslint.config.cjs', 'public'],
      }),
      'utf8',
    )
    mkdirSync('test-project-transform/pages')
    mkdirSync('test-project-transform/unpackage')
    mkdirSync('test-project-transform/assets')
    mkdirSync('test-project-transform/public')
    const { stdout } = await execaUniapp(`transform ${projectPath} ${targetDir} --module router i18n vuex sass`)
    assert.equal(
      stdout,
      `包含HBuilderX内置模块: router, i18n, vuex, sass

运行以下命令开始吧:
  cd ${targetDir}
  pnpm install
  uniapp run h5
`,
    )
    const packageJson = readJsonFile<PackageJson>(resolve(targetDir, 'package.json'))
    assert.equal(packageJson.dependencies?.sass, '*')
    const jsconfig = readJsonFile<{ compilerOptions?: ts.CompilerOptions; include?: string[]; exclude?: string[] }>(
      resolve(targetDir, 'jsconfig.json'),
    )
    assert.deepEqual(jsconfig?.compilerOptions?.paths, {
      '@/common/*': ['./src/common/*'],
      '@': ['./src'],
    })
    assert.deepEqual(jsconfig?.exclude, ['node_modules', 'src/unpackage', 'example', './src/jquery/', '/.prettier'])
    assert.deepEqual(jsconfig?.include, ['src/pages', '/src/assets', './static', 'eslint.config.cjs', 'public'])
    rmSync(targetDir, { force: true, recursive: true })
  })
})
