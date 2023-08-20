/**
 * @type {Record<Platform,PlatformConfig>}>}
 */
exports.ALL_PLATFORMS = {
  android: { modules: ['@dcloudio/uni-app-plus', 'uniapp-android'] },
  ios: { modules: ['@dcloudio/uni-app-plus', 'uniapp-ios'] },
  h5: { modules: ['@dcloudio/uni-h5'] },
  'mp-weixin': { modules: ['@dcloudio/uni-mp-weixin'], envs: ['WEIXIN_DEV_TOOL'] },
  'mp-alipay': { modules: ['@dcloudio/uni-mp-alipay'], envs: ['ALIPAY_DEV_TOOL'] },
  'mp-baidu': { modules: ['@dcloudio/uni-mp-baidu'], envs: ['BAIDU_DEV_TOOL'] },
  'mp-toutiao': { modules: ['@dcloudio/uni-mp-toutiao'], envs: ['TOUTIAO_DEV_TOOL'] },
  'mp-lark': { modules: ['@dcloudio/uni-mp-lark'], envs: ['LARK_DEV_TOOL'] },
  'mp-qq': { modules: ['@dcloudio/uni-mp-qq'], envs: ['QQ_DEV_TOOL'] },
  'mp-kuaishou': { modules: ['@dcloudio/uni-mp-kuaishou'], envs: ['KUAISHOU_DEV_TOOL'] },
  'mp-jd': { modules: ['@dcloudio/uni-mp-jd'], envs: ['JD_DEV_TOOL'] },
  'mp-360': { modules: ['@dcloudio/uni-mp-360'], vue3NotSupport: true, envs: ['360_DEV_TOOL'] },
  'mp-xhs': { modules: ['@dcloudio/uni-mp-xhs'], vue3NotSupport: true, envs: ['XHS_DEV_TOOL'] },
  'quickapp-union': { modules: ['@dcloudio/uni-quickapp-webview'], envs: ['QUICKAPP_DEV_TOOL'] },
  'quickapp-huawei': { modules: ['@dcloudio/uni-quickapp-webview'], envs: ['HUAWEI_DEV_TOOL'] },
};
