import type { PackageJson } from "pkg-types";
import type { ManifestConfig } from "@uniapp-cli/common";

type MaybePromise<T> = T | Promise<T>;

export interface CommonOptions {
  /** Current project Package.json content */
  packages: PackageJson;
}
export interface PlatformAddOptions extends CommonOptions {
  /** Current project UniApp version  */
  version: string;
  manifest?: ManifestConfig;
}
export interface RunOptions {
  debug?: boolean;
  release?: boolean;
  device?: boolean;
  emulator?: boolean;
  list?: boolean;
  target?: string;
}
export interface ModuleClass {
  modules: string[];
  requirement: (options: CommonOptions) => MaybePromise<void>;
  platformAdd: (options: PlatformAddOptions) => MaybePromise<void>;
  platformRemove: (options: CommonOptions) => MaybePromise<void>;
  run: (options: RunOptions) => MaybePromise<void>;
}

export enum PLATFORM {
  ANDROID = "android",
  IOS = "ios",
  H5 = "h5",
  MP_WEIXIN = "mp-weixin",
  MP_ALIPAY = "mp-alipay",
  MP_BAIDU = "mp-baidu",
  MP_TOUTIAO = "mp-toutiao",
  MP_LARK = "mp-lark",
  MP_QQ = "mp-qq",
  MP_KUAISHOU = "mp-kuaishou",
  MP_JD = "mp-jd",
  MP_360 = "mp-360",
  MP_XHS = "mp-xhs",
  MP_QUICKAPP_UNION = "quickapp-union",
  MP_QUICKAPP_HUAWEI = "quickapp-huawei",
}
export const allPlatforms = [
  PLATFORM.ANDROID,
  PLATFORM.IOS,
  PLATFORM.H5,
  PLATFORM.MP_WEIXIN,
  PLATFORM.MP_ALIPAY,
  PLATFORM.MP_BAIDU,
  PLATFORM.MP_TOUTIAO,
  PLATFORM.MP_LARK,
  PLATFORM.MP_QQ,
  PLATFORM.MP_KUAISHOU,
  PLATFORM.MP_JD,
  PLATFORM.MP_360,
  PLATFORM.MP_XHS,
  PLATFORM.MP_QUICKAPP_UNION,
  PLATFORM.MP_QUICKAPP_HUAWEI,
];

export async function importPlatform(platform: PLATFORM): Promise<ModuleClass> {
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
