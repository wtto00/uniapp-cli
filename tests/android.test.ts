import assert from 'node:assert'
import { rm, writeFileSync } from 'node:fs'
import { after, before, describe, it } from 'node:test'
import { execaSync } from 'execa'
import { readJsonFile } from '../src/utils/file.js'
import Log from '../src/utils/log.js'
import { AndroidAbiFilters, type ManifestConfig } from '../src/utils/manifest.config.js'
import { execaUniapp, execaUniappSync } from './helper.js'

describe('android', () => {
  before(
    async () => {
      execaUniappSync('create test-project-android --template dcloudio/uni-preset-vue#vite-ts')
      process.chdir('test-project-android')
      execaSync`pnpm --ignore-workspace --no-lockfile install`
    },
    { timeout: 90000 },
  )

  after(
    async () => {
      process.chdir('..')
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          rm('test-project-android', { force: true, recursive: true }, (err) => {
            if (err) reject(err)
            else resolve(undefined)
          })
        }, 1000),
      )
    },
    { timeout: 90000 },
  )

  it('add', { timeout: 60000 }, async () => {
    const { stdout } = await execaUniapp('platform add android')

    assert.equal(stdout, Log.errorColor('平台 android 添加失败: 请在文件manifest.json中配置应用名称: name'))
    const manifest = readJsonFile<ManifestConfig>('src/manifest.json', true)

    manifest.name = 'Test Project Platform'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout1 } = await execaUniapp('platform add android')
    assert.equal(stdout1, Log.errorColor('平台 android 添加失败: 请在文件manifest.json中配置应用appid: appid'))

    manifest.appid = '__UNI__1FC8DF9'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout2 } = await execaUniapp('platform add android')
    assert.equal(
      stdout2,
      Log.errorColor(
        '平台 android 添加失败: 请在文件manifest.json中配置应用Appkey: app-plus.distribute.android.dcloud_appkey',
      ),
    )

    if (manifest['app-plus']?.distribute?.android)
      manifest['app-plus'].distribute.android.dcloud_appkey = 'c1b4ac7b9a38a1036528ac460ac70f18'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout3 } = await execaUniapp('platform add android')
    assert.equal(
      stdout3,
      Log.errorColor(
        '平台 android 添加失败: 请在文件manifest.json中配置应用包名: app-plus.distribute.android.packagename',
      ),
    )

    if (manifest['app-plus']?.distribute?.android)
      manifest['app-plus'].distribute.android.packagename = 'com.example.uniapp'
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout4 } = await execaUniapp('platform add android')
    assert.equal(
      stdout4,
      Log.errorColor(
        '平台 android 添加失败: 请在文件manifest.json中配置应用所支持的CPU类型: app-plus.distribute.android.abiFilters',
      ),
    )

    if (manifest['app-plus']?.distribute?.android)
      manifest['app-plus'].distribute.android.abiFilters = [AndroidAbiFilters.x64, AndroidAbiFilters.ARM64]
    writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')
    const { stdout: stdout5 } = await execaUniapp('platform add android')
    assert.equal(stdout5, Log.successColor('平台 android 已成功添加'))
  })

  it('remove', { timeout: 60000, todo: true })
  it('run', { timeout: 60000, todo: true })
  it('build', { timeout: 60000, todo: true })
})
