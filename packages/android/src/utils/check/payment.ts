import { AppPlusOS, Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkPayment(manifest: ManifestConfig) {
  const Payment = manifest['app-plus']?.modules?.Payment
  if (!Payment) return true

  const payment = manifest['app-plus']?.distribute?.sdkConfigs?.payment

  const errors: string[] = []

  if (payment?.weixin?.__platform__?.includes(AppPlusOS.Android)) {
    if (!payment.weixin.appid) {
      errors.push(
        '您配置了微信支付，请在文件manifest.json中配置微信支付的Appid: app-plus.distribute.sdkConfigs.payment.weixin.appid',
      )
    }
  }
  if (payment?.paypal?.__platform__?.includes(AppPlusOS.Android)) {
    if (!payment.paypal.returnURL_android) {
      errors.push(
        '您配置了Paypal支付，请在文件manifest.json中配置Paypal支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.paypal.returnURL_android',
      )
    }
  }
  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
