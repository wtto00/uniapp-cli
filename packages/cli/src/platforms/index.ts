import { PLATFORM } from "../utils/platform";

export async function importPlatform(platform: PLATFORM) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return (await import("./android")).default;
    case PLATFORM.IOS:
      return (await import("./ios")).default;
    case PLATFORM.H5:
      return (await import("./h5")).default;
    case PLATFORM.MP_WEIXIN:
      return (await import("./mp-weixin")).default;
    case PLATFORM.MP_ALIPAY:
      return (await import("./mp-alipay")).default;
    case PLATFORM.MP_BAIDU:
      return (await import("./mp-baidu")).default;
    case PLATFORM.MP_TOUTIAO:
      return (await import("./mp-toutiao")).default;
    case PLATFORM.MP_LARK:
      return (await import("./mp-lark")).default;
    case PLATFORM.MP_QQ:
      return (await import("./mp-qq")).default;
    case PLATFORM.MP_KUAISHOU:
      return (await import("./mp-kuaishou")).default;
    case PLATFORM.MP_JD:
      return (await import("./mp-jd")).default;
    case PLATFORM.MP_360:
      return (await import("./mp-360")).default;
    case PLATFORM.MP_XHS:
      return (await import("./mp-xhs")).default;
    case PLATFORM.MP_QUICKAPP_UNION:
      return (await import("./quickapp-union")).default;
    case PLATFORM.MP_QUICKAPP_HUAWEI:
      return (await import("./quickapp-huawei")).default;
    default:
      process.Log.error(`Unknown platform: ${platform}.`);
      process.exit();
  }
}
