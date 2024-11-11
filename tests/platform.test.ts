import assert from 'node:assert'
import { rmSync, writeFileSync } from 'node:fs'
import { after, before, describe, it } from 'node:test'
import { execaSync } from 'execa'
import { readJsonFile } from '../src/utils/file.js'
import Log from '../src/utils/log.js'
import { AndroidAbiFilters, type ManifestConfig } from '../src/utils/manifest.config.js'
import { execaUniapp, execaUniappSync } from './helper.js'

const HELP_TEXT = `Usage: uniapp platform <command> [options]

管理应用的平台

Options:
  -h, --help               帮助信息

Commands:
  add <platform...>        添加并安装给定的平台
  rm|remove <platform...>  移除并卸载给定的平台
  ls|list                  列出所有已安装和可用的平台
  help [command]           display help for command`
const ADD_HELP_TEXT = `Usage: uniapp platform add <platform...>

添加并安装给定的平台

Arguments:
  platform    要添加的平台: android,ios,h5,mp-weixin...

Options:
  -h, --help  帮助信息`
const LS_HELP_TEXT = `Usage: uniapp platform ls|list [options]

列出所有已安装和可用的平台

Options:
  -h, --help  帮助信息`
const RM_HELP_TEXT = `Usage: uniapp platform rm|remove <platform...>

移除并卸载给定的平台

Arguments:
  platform    要移除的平台: android,ios,h5,mp-weixin...

Options:
  -h, --help  帮助信息`

describe('platform', () => {
  before(
    () => {
      execaUniappSync('create test-project-platform --template dcloudio/uni-preset-vue#vite-ts')
      process.chdir('test-project-platform')
      execaSync`pnpm install`
    },
    { timeout: 60000 },
  )

  after(
    () => {
      process.chdir('..')
      rmSync('test-project-platform', { force: true, recursive: true })
    },
    { timeout: 60000 },
  )

  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help platform')
    assert.equal(stdout, HELP_TEXT)
  })

  it('help add', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('platform help add')
    assert.equal(stdout, ADD_HELP_TEXT)
  })

  it('help ls', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('platform ls --help')
    assert.equal(stdout, LS_HELP_TEXT)
  })

  it('help rm', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('platform help remove')
    assert.equal(stdout, RM_HELP_TEXT)
  })

  it('ls', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('platform ls')
    assert.equal(
      stdout,
      `android:              ${Log.warnColor(`${Log.failSignal} 未安装`)}
ios:                  ${Log.warnColor(`${Log.failSignal} 未安装`)}
harmony:              ${Log.warnColor(`${Log.failSignal} 未安装`)}
h5:                   ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-weixin:            ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-alipay:            ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-baidu:             ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-toutiao:           ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-lark:              ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-qq:                ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-kuaishou:          ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-jd:                ${Log.successColor(`${Log.successSignal} 已安装`)}
mp-360:               ${Log.warnColor(`${Log.failSignal} 未安装`)}
mp-xhs:               ${Log.successColor(`${Log.successSignal} 已安装`)}
quickapp-union:       ${Log.successColor(`${Log.successSignal} 已安装`)}
quickapp-huawei:      ${Log.successColor(`${Log.successSignal} 已安装`)}`,
    )
  })

  it('rm mp-xhs', { timeout: 60000 }, async () => {
    const { stdout } = await execaUniapp('platform rm mp-xhs')
    assert.equal(stdout, Log.successColor(`${Log.successSignal} 平台 mp-xhs 已成功移除。`))
  })

  it('rm invalid platform', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('platform rm xxx')
    assert.equal(stdout, Log.errorColor('xxx 不是一个有效的平台。\n'))
  })

  it('add invalid platform', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('platform add xxx')
    assert.equal(stdout, Log.errorColor('xxx 不是一个有效的平台。\n'))
  })

  it('add mp-xhs', { timeout: 60000 }, async () => {
    const { stdout } = await execaUniapp('platform add mp-xhs')
    assert.equal(stdout, Log.successColor(`${Log.successSignal} 平台 mp-xhs 已成功添加。`))
  })

  it('add android', { timeout: 60000 }, async () => {
    const { stdout } = await execaUniapp('platform add android')
    assert.equal(
      stdout,
      Log.errorColor(`${Log.failSignal} 平台 android 添加失败: 请在文件manifest.json中配置应用名称: name`),
    )
    const manifest = readJsonFile<ManifestConfig>('src/manifest.json', true)

    manifest.name = 'Test Project Platform'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout1 } = await execaUniapp('platform add android')
    assert.equal(
      stdout1,
      Log.errorColor(`${Log.failSignal} 平台 android 添加失败: 请在文件manifest.json中配置应用appid: appid`),
    )

    manifest.appid = '__UNI__1FC8DF9'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout2 } = await execaUniapp('platform add android')
    assert.equal(
      stdout2,
      Log.errorColor(
        `${Log.failSignal} 平台 android 添加失败: 请在文件manifest.json中配置应用Appkey: app-plus.distribute.android.dcloud_appkey`,
      ),
    )

    if (manifest['app-plus']?.distribute?.android)
      manifest['app-plus'].distribute.android.dcloud_appkey = 'c1b4ac7b9a38a1036528ac460ac70f18'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout3 } = await execaUniapp('platform add android')
    assert.equal(
      stdout3,
      Log.errorColor(
        `${Log.failSignal} 平台 android 添加失败: 请在文件manifest.json中配置应用包名: app-plus.distribute.android.packagename`,
      ),
    )

    if (manifest['app-plus']?.distribute?.android)
      manifest['app-plus'].distribute.android.packagename = 'com.example.uniapp'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout4 } = await execaUniapp('platform add android')
    assert.equal(
      stdout4,
      Log.errorColor(
        `${Log.failSignal} 平台 android 添加失败: 请在文件manifest.json中配置应用所支持的CPU类型: app-plus.distribute.android.abiFilters`,
      ),
    )

    if (manifest['app-plus']?.distribute?.android)
      manifest['app-plus'].distribute.android.abiFilters = [AndroidAbiFilters.x64, AndroidAbiFilters.ARM64]
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout5 } = await execaUniapp('platform add android')
    assert.equal(stdout5, Log.successColor(`${Log.successSignal} 平台 android 已成功添加。`))
  })

  it('add ios', { todo: true })

  it('add harmony', { todo: true })
})
