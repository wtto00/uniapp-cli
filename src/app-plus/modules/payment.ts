import { ManifestConfig, AppPlusOS } from '../../utils/manifest.config'

export function checkPayment(manifest: ManifestConfig, os: AppPlusOS) {
  const Payment = manifest['app-plus']?.modules?.Payment
  if (!Payment) return

  const payment = manifest['app-plus']?.distribute?.sdkConfigs?.payment

  if (payment?.weixin && payment.weixin.__platform__?.includes(os)) {
    if (!payment.weixin.appid) {
      throw Error(
        '您配置了微信支付，请在文件manifest.json中配置微信支付的Appid: app-plus.distribute.sdkConfigs.payment.weixin.appid',
      )
    }
    if (os == AppPlusOS.iOS) {
      if (!payment.weixin.UniversalLinks) {
        throw Error(
          '您配置了微信支付，请在文件manifest.json中配置微信支付的iOS平台通用链接: app-plus.distribute.sdkConfigs.payment.weixin.UniversalLinks',
        )
      }
    }
  }
  if (payment?.paypal && payment.paypal.__platform__?.includes(os)) {
    if (
      (os === AppPlusOS.Android && !payment.paypal.returnURL_android) ||
      (os === AppPlusOS.iOS && !payment.paypal.returnURL_ios)
    ) {
      throw Error(
        `您配置了Paypal支付，请在文件manifest.json中配置Paypal支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.paypal.${
          os === AppPlusOS.Android ? 'returnURL_android' : 'returnURL_ios'
        }`,
      )
    }
  }
  if (payment?.stripe && payment.stripe.__platform__?.includes(os)) {
    if (os === AppPlusOS.iOS && !payment.stripe.returnURL_ios) {
      throw Error(
        '您配置了Stripe支付，请在文件manifest.json中配置Stripe支付的返回URL地址: app-plus.distribute.sdkConfigs.payment.stripe.returnURL_ios',
      )
    }
  }
}
