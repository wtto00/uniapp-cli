import open from "open";

export enum PLATFORMS {
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

export interface PlatformConfig {
  /** module of platform */
  modules: string[];
  /** platform is support vue3 or not */
  vue3NotSupport?: boolean;
  /** platform require environment */
  envs?: string[];
  /** Check whether the run command is successful */
  runSuccess?: (msg: string, output: string[]) => boolean;
  /** 打开应用程序 */
  opener?: (...args: string[]) => void;
}

export const ALL_PLATFORMS: Record<PLATFORMS, PlatformConfig> = {
  android: { modules: ["@dcloudio/uni-app-plus", "uniapp-android"] },
  ios: { modules: ["@dcloudio/uni-app-plus", "uniapp-ios"] },
  h5: {
    modules: ["@dcloudio/uni-h5"],
    runSuccess: (msg) => /ready in \d+ms./.test(msg),
    opener: (url) => {
      console.log("opener");
      open(url);
    },
  },
  "mp-weixin": { modules: ["@dcloudio/uni-mp-weixin"], envs: ["WEIXIN_DEV_TOOL"] },
  "mp-alipay": { modules: ["@dcloudio/uni-mp-alipay"], envs: ["ALIPAY_DEV_TOOL"] },
  "mp-baidu": { modules: ["@dcloudio/uni-mp-baidu"], envs: ["BAIDU_DEV_TOOL"] },
  "mp-toutiao": { modules: ["@dcloudio/uni-mp-toutiao"], envs: ["TOUTIAO_DEV_TOOL"] },
  "mp-lark": { modules: ["@dcloudio/uni-mp-lark"], envs: ["LARK_DEV_TOOL"] },
  "mp-qq": { modules: ["@dcloudio/uni-mp-qq"], envs: ["QQ_DEV_TOOL"] },
  "mp-kuaishou": { modules: ["@dcloudio/uni-mp-kuaishou"], envs: ["KUAISHOU_DEV_TOOL"] },
  "mp-jd": { modules: ["@dcloudio/uni-mp-jd"], envs: ["JD_DEV_TOOL"] },
  "mp-360": { modules: ["@dcloudio/uni-mp-360"], vue3NotSupport: true, envs: ["360_DEV_TOOL"] },
  "mp-xhs": { modules: ["@dcloudio/uni-mp-xhs"], vue3NotSupport: true, envs: ["XHS_DEV_TOOL"] },
  "quickapp-union": { modules: ["@dcloudio/uni-quickapp-webview"], envs: ["QUICKAPP_DEV_TOOL"] },
  "quickapp-huawei": { modules: ["@dcloudio/uni-quickapp-webview"], envs: ["HUAWEI_DEV_TOOL"] },
};
