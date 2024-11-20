import { App } from '../../utils/app.js'
import Log from '../../utils/log.js'
import { AppPlusOS } from '../../utils/manifest.config.js'

export function checkPayment(os: AppPlusOS) {
  const manifest = App.getManifestJson()
  const Payment = manifest['app-plus']?.modules?.Payment
  if (!Payment) return true

  const payment = manifest['app-plus']?.distribute?.sdkConfigs?.payment

  const errors: string[] = []

  if (payment?.weixin?.__platform__?.includes(os)) {
    if (!payment.weixin.appid) {
      errors.push(
        '您配置了微信支付，请在文件manifest.json中配置微信支付的Appid: app-plus.distribute.sdkConfigs.payment.weixin.appid',
      )
    }
    if (os === AppPlusOS.iOS) {
      if (!payment.weixin.UniversalLinks) {
        errors.push(
          '您配置了微信支付，请在文件manifest.json中配置微信支付的iOS平台通用链接: app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
        )
      }
    }
  }
  if (payment?.paypal?.__platform__?.includes(os)) {
    if (
      (os === AppPlusOS.Android && !payment.paypal.returnURL_android) ||
      (os === AppPlusOS.iOS && !payment.paypal.returnURL_ios)
    ) {
      errors.push(
        `您配置了Paypal支付，请在文件manifest.json中配置Paypal支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.paypal.${
          os === AppPlusOS.Android ? 'returnURL_android' : 'returnURL_ios'
        }`,
      )
    }
  }
  if (payment?.stripe?.__platform__?.includes(os)) {
    if (os === AppPlusOS.iOS && !payment.stripe.returnURL_ios) {
      errors.push(
        '您配置了Stripe支付，请在文件manifest.json中配置Stripe支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.stripe.returnURL_ios',
      )
    }
  }
  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
