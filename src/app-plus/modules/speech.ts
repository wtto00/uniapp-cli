import { ManifestConfig, AppPlusOS } from '../../utils/manifest.config'

export function checkSpeech(manifest: ManifestConfig, os: AppPlusOS) {
  const Speech = manifest['app-plus']?.modules?.Speech
  if (!Speech) return

  const speech = manifest['app-plus']?.distribute?.sdkConfigs?.speech
  if (speech?.baidu) {
    if (speech.baidu.__platform__?.includes(os)) {
      if (
        (os == AppPlusOS.Android && !speech.baidu.appid_android) ||
        (os == AppPlusOS.iOS && !speech.baidu.appid_ios)
      ) {
        throw Error(
          `您配置了百度语音，请在文件manifest.json中配置百度语音的AppID: app-plus.distribute.sdkConfigs.speech.baidu.${
            os === AppPlusOS.Android ? 'appid_android' : 'appid_ios'
          }`,
        )
      }
      if (
        (os == AppPlusOS.Android && !speech.baidu.apikey_android) ||
        (os == AppPlusOS.iOS && !speech.baidu.apikey_ios)
      ) {
        throw Error(
          `您配置了百度语音，请在文件manifest.json中配置百度语音的API Key: app-plus.distribute.sdkConfigs.speech.baidu.${
            os === AppPlusOS.Android ? 'apikey_android' : 'apikey_ios'
          }`,
        )
      }
      if (
        (os == AppPlusOS.Android && !speech.baidu.secretkey_android) ||
        (os == AppPlusOS.iOS && !speech.baidu.secretkey_ios)
      ) {
        throw Error(
          `您配置了百度语音，请在文件manifest.json中配置百度语音的Secret Key: app-plus.distribute.sdkConfigs.speech.baidu.${
            os === AppPlusOS.Android ? 'secretkey_android' : 'secretkey_ios'
          }`,
        )
      }
    }
  }

  if (os === AppPlusOS.Android && speech?.xunfei) {
    if (!speech.xunfei.appid) {
      throw Error(
        `您配置了讯飞语音，请在文件manifest.json中配置讯飞语音的AppID: app-plus.distribute.sdkConfigs.speech.xunfei.appid`,
      )
    }
  }
}
