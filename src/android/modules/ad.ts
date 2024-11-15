import { App } from '../../utils/app.js'
import { appendMerge, appendSet } from '../../utils/xml.js'
import type { Results } from '../prepare.js'
import { appendMetaData, appendPermissions, appendProvider } from '../templates/AndroidManifest.xml.js'
import { appendDependencies } from '../templates/app-build.gradle.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendBarcode(results: Results) {
  const manifest = App.getManifestJson()
  const ad = manifest['app-plus']?.distribute?.sdkConfigs?.ad
  if (!ad) return

  appendMetaData(results.androidManifest, {
    DCLOUD_AD_SPLASH: { value: `${ad.config?.splash ?? false}` },
  })

  if (ad.config?.nvue) {
    results.libs.add('weex_ad-release.aar')
  }

  const applicationId = manifest['app-plus']?.distribute?.android?.packagename

  if (ad.pg) {
    appendSet(results.libs, ['ads-release.aar', 'ads-csj-release.aar', 'open_ad_sdk.aar'])

    appendProvider(results.androidManifest, {
      'com.bytedance.sdk.openadsdk.TTFileProvider': {
        properties: {
          'android:authorities': `${applicationId}.TTFileProvider`,
          'android:exported': 'false',
          'android:grantUriPermissions': 'true',
        },
        metaData: {
          'android.support.FILE_PROVIDER_PATHS': {
            resource: '@xml/file_paths',
            replace: 'android:resource',
          },
        },
      },
      'com.bytedance.sdk.openadsdk.multipro.TTMultiProvider': {
        properties: {
          'android:authorities': `${applicationId}.TTMultiProvider`,
          'android:exported': 'false',
        },
      },
    })

    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        csj: 'io.dcloud.feature.ad.csj.ADCsjModule',
      },
    })
  }

  if (ad.gdt) {
    appendSet(results.libs, ['ads-release.aar', 'ads-gdt-release.aar', 'GDTSDK.unionNormal.aar'])

    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        gdt: 'io.dcloud.feature.ad.gdt.ADGdtModule',
      },
    })
  }

  if (ad.ks || ad['ks-content']) {
    results.libs.add('ads-release.aar')
    if (ad.ks) {
      appendSet(results.libs, ['ads-ks-release.aar', 'ks_adsdk-ad.aar'])
    } else if (ad['ks-content']) {
      appendSet(results.libs, ['ads-ks-content-release.aar', 'kssdk-allad-content.aar'])
    }

    appendPermissions(results.androidManifest, {
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      [`${applicationId}.permission.KW_SDK_BROADCAST`]: {
        __tag__: 'permission',
        'android:protectionLevel': 'signature',
      },
      [`${applicationId}.permission.KW_SDK_BROADCAST`]: {
        __tag__: 'uses-permission',
      },
    })

    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        ks: 'io.dcloud.feature.ad.ks.ADKsModule',
      },
    })
  }

  if (ad.sigmob) {
    appendSet(results.libs, ['ads-release.aar', 'ads-sigmob-release.aar', 'windAd.aar', 'wind-common.aar'])
    appendPermissions(results.androidManifest, {
      'android.permission.INTERNET': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.ACCESS_COARSE_LOCATION': {},
      'android.permission.ACCESS_FINE_LOCATION': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': { 'tools:node': 'replace' },
      'android.permission.READ_EXTERNAL_STORAGE': {},
      'android.permission.CHANGE_WIFI_STATE': {},
      'android.permission.REQUEST_INSTALL_PACKAGES': {},
    })
    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        sgm: 'io.dcloud.feature.ad.sigmob.ADSMModule',
      },
    })
  }

  if (ad.bd) {
    appendSet(results.libs, ['ads-release.aar', 'ads-bd-release.aar', 'Baidu_MobAds_SDK.aar'])
    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        bd: 'io.dcloud.feature.ad.bd.ADBDModule',
      },
    })
  }

  if (ad.hw) {
    appendSet(results.libs, ['ads-release.aar', 'ads-hw-release.aar'])

    appendMerge(results.buildGradle, 'repositories', {
      'https://developer.huawei.com/repo/': {},
    })
    results.buildGradle.dependencies.add('com.huawei.agconnect:agcp:1.6.0.300')
    appendMerge(results.buildGradle, 'allRepositories', {
      'https://developer.huawei.com/repo/': {},
    })

    appendDependencies(results.appBuildGradle, {
      'com.huawei.hms:ads-lite:13.4.56.302': {},
      'com.huawei.hms:ads-omsdk:1.3.35': {},
    })
    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        hw: 'io.dcloud.feature.ad.hw.AdHwModule',
      },
    })
  }

  if (ad.gm) {
    appendSet(results.libs, ['ads-release.aar', 'ads-gromore-release.aar', 'open_ad_sdk.aar'])
    appendPermissions(results.androidManifest, {
      'android.permission.INTERNET': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
      'android.permission.READ_EXTERNAL_STORAGE': {},
      'android.permission.REQUEST_INSTALL_PACKAGES': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.WAKE_LOCK': {},
      'android.permission.QUERY_ALL_PACKAGES': {},
      'android.permission.ACCESS_FINE_LOCATION': {},
      'android.permission.CHANGE_WIFI_STATE': {},
      'android.permission.GET_TASKS': {},
      'android.permission.ACCESS_COARSE_LOCATION': {},
      'android.permission.ACCESS_WIFI_STATE': {},
    })
    appendFeature(results.properties, {
      name: 'Ad',
      value: 'io.dcloud.feature.ad.AdFlowFeatureImpl',
      module: {
        gm: 'io.dcloud.feature.ad.gm.AdGMModule',
      },
    })
  }
}
