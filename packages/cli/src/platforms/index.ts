import { PLATFORM } from "../utils/platform.js";

export async function importPlatform(platform: PLATFORM) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return (await import("./android.js")).default;
    case PLATFORM.IOS:
      return (await import("./ios.js")).default;
    case PLATFORM.H5:
      return (await import("./h5.js")).default;
    case PLATFORM.MP_WEIXIN:
      return (await import("./mp-weixin.js")).default;
    case PLATFORM.MP_ALIPAY:
      return (await import("./mp-alipay.js")).default;
    case PLATFORM.MP_BAIDU:
      return (await import("./mp-baidu.js")).default;
    case PLATFORM.MP_TOUTIAO:
      return (await import("./mp-toutiao.js")).default;
    case PLATFORM.MP_LARK:
      return (await import("./mp-lark.js")).default;
    case PLATFORM.MP_QQ:
      return (await import("./mp-qq.js")).default;
    case PLATFORM.MP_KUAISHOU:
      return (await import("./mp-kuaishou.js")).default;
    case PLATFORM.MP_JD:
      return (await import("./mp-jd.js")).default;
    case PLATFORM.MP_360:
      return (await import("./mp-360.js")).default;
    case PLATFORM.MP_XHS:
      return (await import("./mp-xhs.js")).default;
    case PLATFORM.MP_QUICKAPP_UNION:
      return (await import("./quickapp-union.js")).default;
    case PLATFORM.MP_QUICKAPP_HUAWEI:
      return (await import("./quickapp-huawei.js")).default;
    default:
      process.Log.error(`Unknown platform: ${platform}.`);
      process.exit();
  }
}
