import { Results } from '../prepare'
import { appendMetaData, appendPermissions, appendService } from '../templates/AndroidManifest.xml'
import { appendSet } from '../../utils/util'
import { appendFeature } from '../templates/dcloud_properties.xml'
import { appendDependencies, appendPlugin } from '../templates/app-build.gradle'
import { resolve } from 'node:path'
import { androidDir } from '../../utils/path'
import { ManifestConfig } from '../../utils/manifest.config'

export function appendStatistic(results: Results, manifest: ManifestConfig) {
  const Statistic = manifest['app-plus']?.modules?.Statistic
  if (!Statistic) return

  const statics = manifest['app-plus']?.distribute?.sdkConfigs?.statics

  if (statics?.umeng) {
    appendSet(results.libs, [
      'statistic-release.aar',
      statics.umeng.google_play ? 'statistic-umeng-gp-release.aar' : 'statistic-umeng-release.aar',
    ])
    appendPermissions(results.androidManifest, {
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.INTERNET': {},
    })
    appendMetaData(results.androidManifest, {
      UMENG_APPKEY: { value: statics.umeng.appkey_android },
      UMENG_CHANNEL: { value: statics.umeng.channelid_android },
    })
    if (statics.umeng.google_play) {
      appendSet(results.buildGradle.dependencies, ['com.umeng.umsdk:apm:1.9.5'])
    } else {
      appendSet(results.buildGradle.dependencies, [
        'com.umeng.umsdk:common:9.6.1',
        'com.umeng.umsdk:asms:1.8.0',
        'com.umeng.umsdk:abtest:1.0.1',
        'com.umeng.umsdk:apm:1.9.1',
      ])
    }
    appendFeature(results.properties, {
      name: 'Statistic',
      value: 'io.dcloud.feature.statistics.StatisticsFeatureImpl',
      module: {
        'Statistic-Umeng': 'io.dcloud.feature.statistics.umeng.UmengStatistics',
      },
    })
    appendService(results.androidManifest, {
      'Statistic-Umeng': {
        properties: {
          value: 'io.dcloud.feature.statistics.umeng.StatisticsBootImpl',
        },
      },
    })
  }

  if (statics?.google) {
    appendSet(results.libs, ['statistic-release.aar', 'statistic-google-release.aar'])
    appendSet(results.buildGradle.dependencies, ['com.google.gms:google-services:4.2.0'])
    appendPlugin(results.appBuildGradle, ['com.google.gms.google-services'])
    appendDependencies(results.appBuildGradle, {
      'com.google.firebase:firebase-analytics:21.3.0': {},
    })
    const googleServicesPath = resolve(androidDir, 'app', 'google-services.json')
    results.filesCopy[googleServicesPath] = resolve(global.projectRoot, 'src', statics.google.config_android ?? '')
    appendFeature(results.properties, {
      name: 'Statistic',
      value: 'io.dcloud.feature.statistics.StatisticsFeatureImpl',
      module: {
        'Statistic-Google': 'io.dcloud.feature.statistics.google.GoogleStatistics',
      },
    })
  }
}
