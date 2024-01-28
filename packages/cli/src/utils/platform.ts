import { resolve } from "path";
import { getModuleVersion, isInstalled } from "./package";
import { PackageJson } from "pkg-types";
import { existsSync } from "fs";

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

export function getModules(platform: PLATFORM) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return ["@dcloudio/uni-app-plus", "uniapp-android"];
    case PLATFORM.IOS:
      return ["@dcloudio/uni-app-plus", "uniapp-ios"];
    case PLATFORM.H5:
      return ["@dcloudio/uni-h5"];
    case PLATFORM.MP_WEIXIN:
      return ["@dcloudio/uni-mp-weixin"];
    case PLATFORM.MP_ALIPAY:
      return ["@dcloudio/uni-mp-alipay"];
    case PLATFORM.MP_BAIDU:
      return ["@dcloudio/uni-mp-baidu"];
    case PLATFORM.MP_TOUTIAO:
      return ["@dcloudio/uni-mp-toutiao"];
    case PLATFORM.MP_LARK:
      return ["@dcloudio/uni-mp-lark"];
    case PLATFORM.MP_QQ:
      return ["@dcloudio/uni-mp-qq"];
    case PLATFORM.MP_KUAISHOU:
      return ["@dcloudio/uni-mp-kuaishou"];
    case PLATFORM.MP_JD:
      return ["@dcloudio/uni-mp-jd"];
    case PLATFORM.MP_360:
      return ["@dcloudio/uni-mp-360"];
    case PLATFORM.MP_XHS:
      return ["@dcloudio/uni-mp-xhs"];
    case PLATFORM.MP_QUICKAPP_UNION:
      return ["@dcloudio/uni-quickapp-webview"];
    case PLATFORM.MP_QUICKAPP_HUAWEI:
      return ["@dcloudio/uni-quickapp-webview"];
    default:
      console.error(`Unknown platform: ${platform}.`);
      return [];
  }
}

export function isModulesInstalled(platform: PLATFORM, packages: PackageJson) {
  return getModules(platform).every((module) => isInstalled(packages, module));
}

export function notSupportVue3(platform: PLATFORM) {
  return platform === PLATFORM.MP_360 || platform === PLATFORM.MP_XHS;
}

export async function isVue3Supported(platform: PLATFORM, packages: PackageJson) {
  const vueVersion = await getModuleVersion(packages, "vue");
  if (vueVersion < "3") return true;
  if (notSupportVue3(platform)) {
    return false;
  }
  return true;
}

export function isWechatDevToolsInstalled() {
  if (process.platform !== "win32" && process.platform !== "darwin") {
    console.error(`Wechat web devTools is not supported on ${process.platform}`);
    return false;
  }
  if (process.env.WEIXIN_DEV_TOOL) {
    if (existsSync(process.env.WEIXIN_DEV_TOOL)) {
      return true;
    }
  }
  const defaultPath =
    process.platform === "win32"
      ? "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"
      : "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";
  if (existsSync(defaultPath)) {
    return true;
  }
  return false;
}

export function isDevToolsInstalled(platform: PLATFORM) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return true;
    case PLATFORM.IOS:
      return true;
    case PLATFORM.H5:
      return true;
    case PLATFORM.MP_WEIXIN:
      return isWechatDevToolsInstalled();
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

/**
 * Determine if the `run` command is successful
 * @param platform special platform
 * @param msg text output in a single time
 * @param output text array outputted each time
 */
export function isRunSuccessed(platform: PLATFORM, msg: string, output: string[]) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return true;
    case PLATFORM.IOS:
      return true;
    case PLATFORM.H5:
      return /ready in \d+ms./.test(msg);
    case PLATFORM.MP_WEIXIN:
      return /ready in \d+ms./.test(msg);
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

/**
 * Actions after successfully running the `run` command
 * @param platform special platform
 * @param msg text output in a single time
 * @param output text array outputted each time
 */
export function afterRunSuccess(platform: PLATFORM, msg: string, output: string[]) {
  switch (platform) {
    case PLATFORM.ANDROID:
      return true;
    case PLATFORM.IOS:
      return true;
    case PLATFORM.H5:
      const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
      const line = output.find((l) => regex.test(l));
      if (line) {
        const url = line.match(regex)?.[1];
        if (url) {
          import("open").then(({ default: open }) => open(url));
          return true;
        }
      }
      return false;
    case PLATFORM.MP_WEIXIN:
      console.debug("Start open wechat web devTools.");
      import("miniprogram-automator").then(({ default: automator }) => {
        automator
          .launch({
            cliPath: process.env.WEIXIN_DEV_TOOL,
            projectPath: resolve(process.env.PWD as string, "./dist/dev/mp-weixin"),
          })
          .then(() => {
            console.success("Wechat web devTools has been opened.");
          })
          .catch(console.error);
      });
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
