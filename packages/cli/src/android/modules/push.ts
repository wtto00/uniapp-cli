import { Log, ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'
import { appendSet } from '../../utils/util'
import { appendActivity, appendMetaData, appendService } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'
import { appendDependencies, appendPlugin } from '../templates/app-build.gradle'
import { extname, resolve } from 'node:path'
import { androidDir } from '../../utils/path'

export function appendPush(results: Results, manifest: ManifestConfig) {
  const Push = manifest['app-plus']?.modules?.Push
  if (!Push) return

  const push = manifest['app-plus']?.distribute?.sdkConfigs?.push

  if (push?.unipush?.version !== '2') {
    Log.warn('不支持uniPush1.0版本。请改用2.0版本')
    return
  }

  const { appid, appkey, appsecret, icons, offline, fcm, mi, meizu, hms, honor, oppo, vivo } = push.unipush

  // HBuilderX 3.99及以上版本所需的libs仅为：
  appendSet(results.libs, new Set(['aps-release.aar', 'aps-unipush-release.aar']))

  results.appBuildGradle.manifestPlaceholders = {
    ...results.appBuildGradle.manifestPlaceholders,
    GETUI_APPID: appid ?? '',
    'plus.unipush.appid': appid ?? '',
    'plus.unipush.appkey': appkey ?? '',
    'plus.unipush.appsecret': appsecret ?? '',
    'apk.applicationId': manifest['app-plus']?.distribute?.android?.packagename ?? '',
  }

  results.buildGradle.allRepositories.add('https://mvn.getui.com/nexus/content/repositories/releases')

  appendDependencies(results.appBuildGradle, {
    'com.getui:gtsdk:3.3.7.0': { exclude: { group: 'com.getui' } },
    'com.getui:gtc-dcloud:3.2.16.7': {},
  })

  appendActivity(results.androidManifest, {
    'io.dcloud.PandoraEntry': {
      properties: {},
      intentFilter: [
        {
          action: new Set(['android.intent.action.VIEW']),
          category: new Set(['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE']),
          data: [
            {
              'android:host': 'io.dcloud.unipush',
              'android:path': '/',
              'android:scheme': 'unipush',
            },
          ],
        },
      ],
    },
  })

  appendFeature(results.properties.features, {
    name: 'Push',
    value: 'io.dcloud.feature.aps.APSFeatureImpl',
    module: {
      unipush: 'io.dcloud.feature.unipush.GTPushService',
    },
  })
  Object.assign(results.properties.services, {
    push: 'io.dcloud.feature.aps.APSFeatureImpl',
  })

  if (icons?.small) {
    const allSize = ['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi'] as const
    allSize.forEach((size) => {
      if (icons.small?.[size]) {
        results.filesCopy[resolve(global.projectRoot, 'src', icons.small?.[size])] = resolve(
          androidDir,
          'app/src/main/res',
          `drawable-${size}`,
          `push${extname(icons.small?.[size])}`,
        )
      }
    })
  }

  if (!offline) return

  if (fcm) {
    appendSet(results.libs, new Set(['aps-release.aar', 'aps-fcm-release.aar']))
    // const sdkForGj = findLibSDK('sdk-for-gj-')
    // if (sdkForGj) results.libs.add(sdkForGj)
    // const fcmSdk = findLibSDK('fcm-')
    // if (fcmSdk) results.libs.add(fcmSdk)
    const googleServicesPath = resolve(global.projectRoot, 'src', fcm.googleServices ?? '')
    results.filesCopy[googleServicesPath] = resolve(androidDir, 'app', 'google-services.json')
    results.buildGradle.dependencies.add('com.google.gms:google-services:4.3.14')
    appendPlugin(results.appBuildGradle, new Set(['com.google.gms.google-services']))
    appendDependencies(results.appBuildGradle, {
      'com.google.firebase:firebase-messaging:23.2.1': {},
    })
    appendService(results.androidManifest, {
      'io.dcloud.feature.fcm.FCMVendorService': {
        properties: {
          'android:exported': 'false',
        },
        intentFilter: [
          {
            action: new Set(['com.google.firebase.MESSAGING_EVENT']),
          },
        ],
      },
    })
    appendMetaData(results.androidManifest, {
      'com.google.firebase.messaging.default_notification_channel_id': { value: fcm.channelId },
      'com.google.firebase.messaging.default_notification_icon': { value: '@drawable/push' },
    })
    appendFeature(results.properties.features, {
      name: 'Push',
      value: 'io.dcloud.feature.aps.APSFeatureImpl',
      module: {
        fcm: 'io.dcloud.feature.fcm.FCMPushService',
      },
    })
  }
  if (hms) {
    // 华为
    results.appBuildGradle.manifestPlaceholders.HUAWEI_APP_ID = hms.appid ?? ''
    appendDependencies(results.appBuildGradle, {
      'com.getui.opt:hwp:3.1.1': {},
      'com.huawei.hms:push:6.11.0.300': {},
    })
    results.buildGradle.repositories.add('https://developer.huawei.com/repo/')
    results.buildGradle.dependencies.add('com.huawei.agconnect:agcp:1.6.0.300')
    results.buildGradle.allRepositories.add('https://developer.huawei.com/repo/')
    appendPlugin(results.appBuildGradle, new Set(['com.android.application', 'com.huawei.agconnect']))
    const agconnectServicesPath = resolve(global.projectRoot, 'src', hms.agconnectServices ?? '')
    results.filesCopy[agconnectServicesPath] = resolve(androidDir, 'app', 'agconnect-services.json')
  }
  if (honor) {
    // 荣耀
    results.appBuildGradle.manifestPlaceholders.HONOR_APP_ID = honor.appid ?? ''
    appendDependencies(results.appBuildGradle, {
      'com.getui.opt:honor:3.6.0': {},
      'com.hihonor.mcs:push:7.0.61.303': {},
    })
    results.buildGradle.repositories.add('https://developer.hihonor.com/repo/')
    results.buildGradle.allRepositories.add('https://developer.hihonor.com/repo/')
  }
  if (meizu) {
    // 魅族
    results.appBuildGradle.manifestPlaceholders.MEIZU_APP_ID = meizu.appid ?? ''
    results.appBuildGradle.manifestPlaceholders.MEIZU_APP_KEY = meizu.appkey ?? ''
    appendDependencies(results.appBuildGradle, {
      'com.getui.opt:mzp:3.2.3': {},
    })
  }
  if (mi) {
    // 小米
    results.appBuildGradle.manifestPlaceholders.XIAOMI_APP_ID = mi.appid ?? ''
    results.appBuildGradle.manifestPlaceholders.XIAOMI_APP_KEY = mi.appkey ?? ''
    appendDependencies(results.appBuildGradle, {
      'com.getui.opt:xmp:3.3.1': {},
    })
  }
  if (oppo) {
    // oppo
    results.appBuildGradle.manifestPlaceholders.OPPO_APP_KEY = oppo.appkey ?? ''
    results.appBuildGradle.manifestPlaceholders.OPPO_APP_SECRET = oppo.appsecret ?? ''
    appendDependencies(results.appBuildGradle, {
      'com.assist-v3:oppo:3.3.0': {},
      'com.google.code.gson:gson:2.6.2': {},
      'commons-codec:commons-codec:1.6': {},
      'androidx.annotation:annotation:1.1.0': {},
    })
    appendActivity(results.androidManifest, {
      'io.dcloud.PandoraEntry': {
        properties: {},
        intentFilter: [
          {
            action: new Set(['android.intent.action.oppopush']),
            category: new Set(['android.intent.category.DEFAULT']),
          },
        ],
      },
    })
    appendDependencies(results.appBuildGradle, {
      'com.assist-v3:oppo:3.3.0': {},
      'com.google.code.gson:gson:2.6.2': {},
      'commons-codec:commons-codec:1.6': {},
      'androidx.annotation:annotation:1.1.0': {},
    })
  }
  if (vivo) {
    // vivo
    results.appBuildGradle.manifestPlaceholders.VIVO_APP_ID = vivo.appid ?? ''
    results.appBuildGradle.manifestPlaceholders.VIVO_APP_KEY = vivo.appkey ?? ''
    appendDependencies(results.appBuildGradle, {
      'com.assist-v3:vivo:3.1.1': {},
    })
  }
}
