import { Results } from '../prepare'
import { appendSet } from '../../utils/util'
import { appendMetaData, appendPermissions, appendService } from '../templates/AndroidManifest.xml'
import { appendFeature } from '../templates/dcloud_properties.xml'
import { ManifestConfig, AppPlusOS } from '../../utils/manifest.config'

export function appendSpeech(results: Results, manifest: ManifestConfig) {
  const Speech = manifest['app-plus']?.modules?.Speech
  if (!Speech) return
  const speech = manifest['app-plus']?.distribute?.sdkConfigs?.speech

  if (speech?.baidu?.__platform__?.includes(AppPlusOS.Android)) {
    appendSet(results.libs, ['speech-release.aar', 'speech_baidu-release.aar'])

    appendPermissions(results.androidManifest, {
      'android.permission.RECORD_AUDIO': {},
      'android.permission.INTERNET': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.CHANGE_NETWORK_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
    })

    appendMetaData(results.androidManifest, {
      'com.baidu.speech.APP_ID': { value: speech.baidu.appid_android },
      'com.baidu.speech.API_KEY': { value: speech.baidu.apikey_android },
      'com.baidu.speech.SECRET_KEY': { value: speech.baidu.secretkey_android },
    })
    appendService(results.androidManifest, {
      'com.baidu.speech.VoiceRecognitionService': {
        properties: {
          'android:exported': 'false',
        },
      },
    })
    appendFeature(results.properties, {
      name: 'Speech',
      value: 'io.dcloud.feature.speech.SpeechFeatureImpl',
      module: {
        baidu: 'io.dcloud.feature.speech.BaiduSpeechEngine',
      },
    })
  }
  if (speech?.xunfei) {
    appendSet(results.libs, ['speech-release.aar', 'speech_ifly-release.aar'])

    appendPermissions(results.androidManifest, {
      'android.permission.RECORD_AUDIO': {},
      'android.permission.INTERNET': {},
      'android.permission.ACCESS_NETWORK_STATE': {},
      'android.permission.ACCESS_WIFI_STATE': {},
      'android.permission.CHANGE_NETWORK_STATE': {},
      'android.permission.READ_PHONE_STATE': {},
      'android.permission.WRITE_EXTERNAL_STORAGE': {},
    })

    appendMetaData(results.androidManifest, {
      IFLY_APPKEY: { value: speech.xunfei.appid },
    })

    appendFeature(results.properties, {
      name: 'Speech',
      value: 'io.dcloud.feature.speech.SpeechFeatureImpl',
      module: {
        iFly: 'io.dcloud.feature.speech.IflySpeechEngine',
      },
    })
  }
}