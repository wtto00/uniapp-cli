import assert from 'node:assert'
import { describe, it } from 'node:test'
import { execaUniapp } from './helper.js'

const HELP_TEXT = `Usage: uniapp run <platform>

开始运行给定的平台

Arguments:
  platform                     要运行的平台: android,ios,h5,mp-weixin...

Options:
  --mode <mode>                vite 环境模式
  --no-open                    不自动打开
  --device <device>            运行到指定的设备上
  --keystore <keystore>        Android签名密钥文件所在位置
  --storepasswd <storepasswd>  Android签名密钥的密码
  --alias <alias>              Android签名密钥别名
  --keypasswd <keypasswd>      Android签名密钥别名的密码
  -h, --help                   帮助信息

示例:
  uniapp run android --device myEmulator
  uniapp run ios
  uniapp run mp-weixin`

describe('run', () => {
  it('help', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('help run')
    assert.equal(stdout, HELP_TEXT)
  })

  it('run h5', { todo: true })
  it('run android', { todo: true })
  it('run ios', { todo: true })
  it('run harmony', { todo: true })
  it('run mp-weixin', { todo: true })
  it('run mp-alipay', { todo: true })
  it('run mp-baidu', { todo: true })
  it('run mp-toutiao', { todo: true })
  it('run mp-lark', { todo: true })
  it('run mp-qq', { todo: true })
  it('run mp-kuaishou', { todo: true })
  it('run mp-jd', { todo: true })
  it('run mp-360', { todo: true })
  it('run mp-xhs', { todo: true })
  it('run quickapp-union', { todo: true })
  it('run quickapp-huawei', { todo: true })
})
