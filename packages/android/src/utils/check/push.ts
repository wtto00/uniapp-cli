import { Log, type ManifestConfig } from '@wtto00/uniapp-common'

export function checkPush(manifest: ManifestConfig) {
  const Push = manifest['app-plus']?.modules?.Push
  if (!Push) return true

  const push = manifest['app-plus']?.distribute?.sdkConfigs?.push

  if (push?.unipush?.version !== '2') return true

  const { appid, appkey, appsecret, offline, fcm, mi, meizu, hms, honor, oppo, vivo } = push.unipush

  const errors: string[] = []

  if (!appid) {
    errors.push(
      '您配置了Push消息推送，请在文件manifest.json中配置Push消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.appid',
    )
  }
  if (!appkey) {
    errors.push(
      '您配置了Push消息推送，请在文件manifest.json中配置Push消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.appkey',
    )
  }
  if (!appsecret) {
    errors.push(
      '您配置了Push消息推送，请在文件manifest.json中配置Push消息推送的AppSecret: app-plus.distribute.sdkConfigs.push.unipush.appsecret',
    )
  }

  if (offline) {
    if (fcm) {
      if (!fcm.serverkey) {
        errors.push(
          '您配置了Google FCM消息推送，请在文件manifest.json中配置Google FCM消息推送的Legancy server key: app-plus.distribute.sdkConfigs.push.unipush.fcm.serverkey',
        )
      }
      if (!fcm.config_android) {
        errors.push(
          '您配置了Google FCM消息推送，请在文件manifest.json中配置Google FCM消息推送的google-services.json配置文件位置: app-plus.distribute.sdkConfigs.push.unipush.fcm.config_android',
        )
      }
      if (!fcm.channelid) {
        errors.push(
          '您配置了Google FCM消息推送，请在文件manifest.json中配置Google FCM消息推送的渠道ID: app-plus.distribute.sdkConfigs.push.unipush.fcm.channelId',
        )
      }
    }
    if (hms) {
      // 华为
      if (!hms.appid) {
        errors.push(
          '您配置了华为离线消息推送，请在文件manifest.json中配置华为离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.hms.appid',
        )
      }
      if (!hms.config) {
        errors.push(
          '您配置了华为离线消息推送，请在文件manifest.json中配置华为离线消息推送的agconnect-services.json配置文件位置: app-plus.distribute.sdkConfigs.push.unipush.hms.agconnectServices',
        )
      }
    }
    if (honor && !honor.appid) {
      // 荣耀
      errors.push(
        '您配置了荣耀离线消息推送，请在文件manifest.json中配置荣耀离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.honor.appid',
      )
    }
    if (meizu) {
      // 魅族
      if (!meizu.appid) {
        errors.push(
          '您配置了魅族离线消息推送，请在文件manifest.json中配置魅族离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.meizu.appid',
        )
      }
      if (!meizu.appkey) {
        errors.push(
          '您配置了魅族离线消息推送，请在文件manifest.json中配置魅族离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.meizu.appkey',
        )
      }
    }
    if (mi) {
      // 小米
      if (!mi.appid) {
        errors.push(
          '您配置了小米离线消息推送，请在文件manifest.json中配置小米离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.mi.appid',
        )
      }
      if (!mi.appkey) {
        errors.push(
          '您配置了小米离线消息推送，请在文件manifest.json中配置小米离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.mi.appkey',
        )
      }
    }
    if (oppo) {
      // oppo
      if (!oppo.appkey) {
        errors.push(
          '您配置了OPPO离线消息推送，请在文件manifest.json中配置OPPO离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.oppo.appkey',
        )
      }
      if (!oppo.appsecret) {
        errors.push(
          '您配置了OPPO离线消息推送，请在文件manifest.json中配置OPPO离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.oppo.appsecret',
        )
      }
    }
    if (vivo) {
      // vivo
      if (!vivo.appid) {
        errors.push(
          '您配置了VIVO离线消息推送，请在文件manifest.json中配置VIVO离线消息推送的AppID: app-plus.distribute.sdkConfigs.push.unipush.vivo.appid',
        )
      }
      if (!vivo.appkey) {
        errors.push(
          '您配置了VIVO离线消息推送，请在文件manifest.json中配置VIVO离线消息推送的AppKey: app-plus.distribute.sdkConfigs.push.unipush.vivo.appkey',
        )
      }
    }
  }

  if (!errors.length) return true

  for (const message of errors) {
    Log.warn(message)
  }
  return false
}
