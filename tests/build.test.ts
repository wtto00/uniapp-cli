import assert from 'node:assert'
import { describe, it } from 'node:test'
import { execaUniapp } from './helper.js'

const HELP_TEXT = `Usage: uniapp build <platform>

打包给定的平台

Arguments:
  platform           要打包的平台: android,ios,h5,mp-weixin...

Options:
  --no-open          不自动打开
  --mode <mode>      vite 环境模式
  --bundle <bundle>  打包产物: aab,apk(默认)
  --device <device>  运行到给定的设备上
  -h, --help         帮助信息

示例:
  uniapp build android --bundle aab
  uniapp build ios
  uniapp build mp-weixin`

describe('build', () => {
  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help build')
    assert.equal(stdout, HELP_TEXT)
  })

  it('build h5', { todo: true })
  it('build android', { todo: true })
  it('build ios', { todo: true })
  it('build harmony', { todo: true })
  it('build mp-weixin', { todo: true })
  it('build mp-alipay', { todo: true })
  it('build mp-baidu', { todo: true })
  it('build mp-toutiao', { todo: true })
  it('build mp-lark', { todo: true })
  it('build mp-qq', { todo: true })
  it('build mp-kuaishou', { todo: true })
  it('build mp-jd', { todo: true })
  it('build mp-360', { todo: true })
  it('build mp-xhs', { todo: true })
  it('build quickapp-union', { todo: true })
  it('build quickapp-huawei', { todo: true })
})
