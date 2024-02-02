import { PLATFORM } from "./platform";

export function beforeRun(platform: PLATFORM) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return true;
    case PLATFORM.IOS:
      return true;
    case PLATFORM.H5:
      return true;
    case PLATFORM.MP_WEIXIN:
      return true;
    case PLATFORM.MP_ALIPAY:
      return true;
    case PLATFORM.MP_BAIDU:
      return true;
    case PLATFORM.MP_TOUTIAO:
      return true;
    case PLATFORM.MP_LARK:
      return true;
    case PLATFORM.MP_QQ:
      return true;
    case PLATFORM.MP_KUAISHOU:
      return true;
    case PLATFORM.MP_JD:
      return true;
    case PLATFORM.MP_360:
      return true;
    case PLATFORM.MP_XHS:
      return true;
    case PLATFORM.MP_QUICKAPP_UNION:
      return true;
    case PLATFORM.MP_QUICKAPP_HUAWEI:
      return true;
    default:
      console.error(`Unknown platform: ${platform}.`);
      return false;
  }
}
