import { AppPlusOS, Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkSpeech(manifest: ManifestConfig) {
  const Speech = manifest['app-plus']?.modules?.Speech
  if (!Speech) return true

  const speech = manifest['app-plus']?.distribute?.sdkConfigs?.speech

  const errors: string[] = []

  if (speech?.baidu) {
    if (speech.baidu.__platform__?.includes(AppPlusOS.Android)) {
      if (!speech.baidu.appid_android) {
        errors.push(
          '您配置了百度语音，请在文件manifest.json中配置百度语音的AppID: app-plus.distribute.sdkConfigs.speech.baidu.appid_android',
        )
      }
      if (!speech.baidu.apikey_android) {
        errors.push(
          '您配置了百度语音，请在文件manifest.json中配置百度语音的API Key: app-plus.distribute.sdkConfigs.speech.baidu.apikey_android',
        )
      }
      if (!speech.baidu.secretkey_android) {
        errors.push(
          '您配置了百度语音，请在文件manifest.json中配置百度语音的Secret Key: app-plus.distribute.sdkConfigs.speech.baidu.secretkey_android',
        )
      }
    }
  }

  if (speech?.xunfei) {
    if (!speech.xunfei.appid) {
      errors.push(
        '您配置了讯飞语音，请在文件manifest.json中配置讯飞语音的AppID: app-plus.distribute.sdkConfigs.speech.xunfei.appid',
      )
    }
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
