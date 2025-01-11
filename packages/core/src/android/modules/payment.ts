import { App } from '../../utils/app.js'
import { AppPlusOS } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'
import { appendActivity, appendMetaData, appendPermissions } from '../templates/AndroidManifest.xml.js'
import { generateWXPayEntryActivity, getWXPayEntryActivityFilePath } from '../templates/WXPayEntryActivity.java.js'
import { appendDependencies, mergeNumberField } from '../templates/app-build.gradle.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendPayment(results: Results) {
  const manifest = App.getManifestJson()
  const Payment = manifest['app-plus']?.modules?.Payment
  if (!Payment) return

  const payment = manifest['app-plus']?.distribute?.sdkConfigs?.payment

  if (payment?.alipay?.__platform__?.includes(AppPlusOS.Android)) {
    results.libs.add('payment-alipay-release.aar')

    appendDependencies(results.appBuildGradle, {
      'com.alipay.sdk:alipaysdk-android:15.8.11': {},
    })

    appendPermissions(results.androidManifest, {
      'android.permission.INTERNET': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
      'android.permission.ACCESS_COARSE_LOCATION': {},
    })

    appendFeature(results.properties, {
      name: 'Payment',
      value: 'io.dcloud.feature.payment.PaymentFeatureImpl',
      module: {
        AliPay: 'io.dcloud.feature.payment.alipay.AliPay',
      },
    })
  }

  if (payment?.weixin?.__platform__?.includes(AppPlusOS.Android)) {
    results.libs.add('payment-weixin-release.aar')

    appendDependencies(results.appBuildGradle, {
      'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:6.8.0': {},
    })

    results.filesWrite[getWXPayEntryActivityFilePath(manifest)] = generateWXPayEntryActivity(manifest)

    appendPermissions(results.androidManifest, {
      'android.permission.MODIFY_AUDIO_SETTINGS': {},
    })

    appendMetaData(results.androidManifest, {
      WX_APPID: { value: payment.weixin.appid },
    })

    appendActivity(results.androidManifest, {
      'io.dcloud.feature.payment.weixin.WXPayProcessMeadiatorActivity': {
        properties: {
          'android:exported': 'false',
          'android:excludeFromRecents': 'true',
          'android:theme': '@style/ProjectDialogTheme',
        },
      },
      [`${manifest['app-plus']?.distribute?.android?.packagename}.wxapi.WXPayEntryActivity`]: {
        properties: {
          'android:exported': 'true',
          'android:theme': '@android:style/Theme.Translucent.NoTitleBar',
          'android:launchMode': 'singleTop',
        },
      },
    })

    appendFeature(results.properties, {
      name: 'Payment',
      value: 'io.dcloud.feature.payment.PaymentFeatureImpl',
      module: {
        'Payment-Weixin': 'io.dcloud.feature.payment.weixin.WeiXinPay',
      },
    })
  }

  if (payment?.paypal?.__platform__?.includes(AppPlusOS.Android)) {
    results.libs.add('payment-paypal-release.aar')

    results.buildGradle.allRepositories['https://cardinalcommerceprod.jfrog.io/artifactory/android'] = {
      credentials: {
        username: 'paypal_sgerritz',
        password: 'AKCp8jQ8tAahqpT5JjZ4FRP2mW7GMoFZ674kGqHmupTesKeAY2G8NcmPKLuTxTGkKjDLRzDUQ',
      },
    }

    appendDependencies(results.appBuildGradle, { 'com.paypal.checkout:android-sdk:0.6.2': {} })

    appendPermissions(results.androidManifest, { 'android.permission.INTERNET': {} })

    const schemes = manifest['app-plus']?.distribute?.android?.schemes?.split(',') ?? []
    appendActivity(results.androidManifest, {
      'com.paypal.openid.RedirectUriReceiverActivity': {
        properties: {
          'android:excludeFromRecents': 'true',
          'android:exported': 'true',
          'android:theme': '@style/PYPLAppTheme',
        },
        intentFilter: [
          {
            action: new Set(['android.intent.action.VIEW']),
            category: new Set(['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE']),
            data: schemes.map((scheme) => ({ 'android:host': 'paypalpay', 'android:scheme': scheme })),
          },
        ],
      },
      'com.paypal.pyplcheckout.home.view.activities.PYPLInitiateCheckoutActivity': {
        properties: {
          'android:exported': 'true',
          'android:theme': '@style/AppFullScreenTheme',
        },
        intentFilter: [
          {
            properties: { 'android:autoVerify': 'true' },
            action: new Set(['android.intent.action.VIEW']),
            category: new Set(['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE']),
            data: schemes.map((scheme) => ({ 'android:host': 'paypalxo', 'android:scheme': scheme })),
          },
        ],
      },
    })

    appendMetaData(results.androidManifest, { returnUrl: { value: payment.paypal.returnURL_android } })

    appendFeature(results.properties, {
      name: 'Payment',
      value: 'io.dcloud.feature.payment.PaymentFeatureImpl',
      module: {
        'Payment-Paypal': 'io.dcloud.feature.payment.paypal.PaypalPay',
      },
    })
  }

  if (payment?.stripe?.__platform__?.includes(AppPlusOS.Android)) {
    results.appBuildGradle.minSdkVersion = mergeNumberField('minSdkVersion', results.appBuildGradle, {
      minSdkVersion: 21,
    })

    results.libs.add('payment-stripe-release.aar')

    appendDependencies(results.appBuildGradle, {
      'androidx.appcompat:appcompat:${rootProject.ext.androidxVersion}': {},
      'androidx.legacy:legacy-support-v4:${rootProject.ext.androidxVersion}': {},
      'com.stripe:stripe-android:18.2.0': {},
    })

    appendActivity(results.androidManifest, {
      'io.dcloud.feature.payment.stripe.TransparentActivity': {
        properties: {
          'android:excludeFromRecents': 'true',
          'android:exported': 'false',
          'android:theme': '@style/TranslucentTheme',
        },
      },
    })

    appendFeature(results.properties, {
      name: 'Payment',
      value: 'io.dcloud.feature.payment.PaymentFeatureImpl',
      module: {
        'Payment-Stripe': 'io.dcloud.feature.payment.stripe.StripePay',
      },
    })
  }

  if (payment?.google) {
    results.libs.add('payment-google-release.aar')

    appendDependencies(results.appBuildGradle, {
      'androidx.appcompat:appcompat:${rootProject.ext.androidxVersion}': {},
      'com.google.android.gms:play-services-wallet:18.1.3': {},
    })

    appendMetaData(results.androidManifest, {
      'com.google.android.gms.wallet.api.enabled': { value: 'true' },
    })

    appendFeature(results.properties, {
      name: 'Payment',
      value: 'io.dcloud.feature.payment.PaymentFeatureImpl',
      module: {
        'Payment-Google': 'io.dcloud.feature.payment.google.GooglePay',
      },
    })
  }
}
