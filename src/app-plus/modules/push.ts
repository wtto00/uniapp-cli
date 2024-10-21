import { ManifestConfig, AppPlusOS } from '../../utils/manifest.config'

export function checkPush(manifest: ManifestConfig, os: AppPlusOS) {
  const Push = manifest['app-plus']?.modules?.Push
  if (!Push) return

  const push = manifest['app-plus']?.distribute?.sdkConfigs?.push

  if (push?.unipush?.version !== '2') return

  const { appid, appkey, appsecret, offline, fcm, mi, meizu, hms, honor, oppo, vivo } = push.unipush

  if (!appid) {
    throw Error(
      '您配置了Push消息推送，请在文件manifest.json中配置Push消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.appid',
    )
  }
  if (!appkey) {
    throw Error(
      '您配置了Push消息推送，请在文件manifest.json中配置Push消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.appkey',
    )
  }
  if (!appsecret) {
    throw Error(
      '您配置了Push消息推送，请在文件manifest.json中配置Push消息推送的AppSecret: app-plus.distribute.sdkConfigs.push.unipush.appsecret',
    )
  }

  if (!offline) return

  if (fcm) {
    if (!fcm.serverkey) {
      throw Error(
        '您配置了Google FCM消息推送，请在文件manifest.json中配置Google FCM消息推送的Legancy server key: app-plus.distribute.sdkConfigs.push.unipush.fcm.serverkey',
      )
    }
    if ((os === AppPlusOS.Android && !fcm.config_android) || (os === AppPlusOS.iOS && !fcm.config_ios)) {
      throw Error(
        `您配置了Google FCM消息推送，请在文件manifest.json中配置Google FCM消息推送的google-services.json配置文件位置: app-plus.distribute.sdkConfigs.push.unipush.fcm.${
          os === AppPlusOS.Android ? 'config_android' : 'config_ios'
        }`,
      )
    }
    if (!fcm.channelid) {
      throw Error(
        '您配置了Google FCM消息推送，请在文件manifest.json中配置Google FCM消息推送的渠道ID: app-plus.distribute.sdkConfigs.push.unipush.fcm.channelId',
      )
    }
  }
  if (hms) {
    // 华为
    if (!hms.appid) {
      throw Error(
        '您配置了华为离线消息推送，请在文件manifest.json中配置华为离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.hms.appid',
      )
    }
    if (!hms.config) {
      throw Error(
        '您配置了华为离线消息推送，请在文件manifest.json中配置华为离线消息推送的agconnect-services.json配置文件位置: app-plus.distribute.sdkConfigs.push.unipush.hms.agconnectServices',
      )
    }
  }
  if (honor && !honor.appid) {
    // 荣耀
    throw Error(
      '您配置了荣耀离线消息推送，请在文件manifest.json中配置荣耀离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.honor.appid',
    )
  }
  if (meizu) {
    // 魅族
    if (!meizu.appid) {
      throw Error(
        '您配置了魅族离线消息推送，请在文件manifest.json中配置魅族离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.meizu.appid',
      )
    }
    if (!meizu.appkey) {
      throw Error(
        '您配置了魅族离线消息推送，请在文件manifest.json中配置魅族离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.meizu.appkey',
      )
    }
  }
  if (mi) {
    // 小米
    if (!mi.appid) {
      throw Error(
        '您配置了小米离线消息推送，请在文件manifest.json中配置小米离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.mi.appid',
      )
    }
    if (!mi.appkey) {
      throw Error(
        '您配置了小米离线消息推送，请在文件manifest.json中配置小米离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.mi.appkey',
      )
    }
  }
  if (oppo) {
    // oppo
    if (!oppo.appkey) {
      throw Error(
        '您配置了OPPO离线消息推送，请在文件manifest.json中配置OPPO离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.oppo.appkey',
      )
    }
    if (!oppo.appsecret) {
      throw Error(
        '您配置了OPPO离线消息推送，请在文件manifest.json中配置OPPO离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.oppo.appsecret',
      )
    }
  }
  if (vivo) {
    // vivo
    if (!vivo.appid) {
      throw Error(
        '您配置了VIVO离线消息推送，请在文件manifest.json中配置VIVO离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.vivo.appid',
      )
    }
    if (!vivo.appkey) {
      throw Error(
        '您配置了VIVO离线消息推送，请在文件manifest.json中配置VIVO离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.vivo.appkey',
      )
    }
  }
}
