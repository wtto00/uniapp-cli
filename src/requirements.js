const { resolve } = require('path');
const Log = require('./log');
const { getPackage, isInstalled, checkIsUniapp, getModuleVersion } = require('./util');
const chalk = require('chalk');

/**
 * @type {Record<Platform,PlatformConfig>}>}
 */
const ALL_PLATFORMS = {
  android: { module: '@dcloudio/uni-app-plus', dependencies: ['uniapp-android'] },
  ios: { module: '@dcloudio/uni-app-plus', dependencies: ['uniapp-ios'] },
  h5: { module: '@dcloudio/uni-h5' },
  'mp-weixin': { module: '@dcloudio/uni-mp-weixin', envs: ['WEIXIN_DEV_TOOL'] },
  'mp-alipay': { module: '@dcloudio/uni-mp-alipay', envs: ['ALIPAY_DEV_TOOL'] },
  'mp-baidu': { module: '@dcloudio/uni-mp-baidu', envs: ['BAIDU_DEV_TOOL'] },
  'mp-toutiao': { module: '@dcloudio/uni-mp-toutiao', envs: ['TOUTIAO_DEV_TOOL'] },
  'mp-lark': { module: '@dcloudio/uni-mp-lark', envs: ['LARK_DEV_TOOL'] },
  'mp-qq': { module: '@dcloudio/uni-mp-qq', envs: ['QQ_DEV_TOOL'] },
  'mp-kuaishou': { module: '@dcloudio/uni-mp-kuaishou', envs: ['KUAISHOU_DEV_TOOL'] },
  'mp-jd': { module: '@dcloudio/uni-mp-jd', envs: ['JD_DEV_TOOL'] },
  'mp-360': { module: '@dcloudio/uni-mp-360', vue3NotSupport: true, envs: ['360_DEV_TOOL'] },
  'mp-xhs': { module: '@dcloudio/uni-mp-xhs', vue3NotSupport: true, envs: ['XHS_DEV_TOOL'] },
  'quickapp-union': { module: '@dcloudio/uni-quickapp-webview', envs: ['QUICKAPP_DEV_TOOL'] },
  'quickapp-huawei': { module: '@dcloudio/uni-quickapp-webview', envs: ['HUAWEI_DEV_TOOL'] },
};

/**
 * print requirements for platforms specified
 * @param {string[]} platforms
 */
module.exports = function requirements(platforms) {
  const packages = getPackage();
  checkIsUniapp(packages);

  const allPlatforms = Object.keys(ALL_PLATFORMS);
  const checkCurrentDirectory = !Array.isArray(platforms) || platforms.length === 0;

  const platform = checkCurrentDirectory
    ? allPlatforms.filter((/** @type {Platform} */ pfm) => {
        const module = ALL_PLATFORMS[pfm].module;
        return isInstalled(packages, module);
      })
    : platforms.reduce((sum, pfm) => {
        if (pfm === 'app') {
          if (!sum.includes('android')) sum.push('android');
          if (!sum.includes('ios')) sum.push('ios');
          return sum;
        }
        if (pfm === 'quickapp') {
          if (!sum.includes('quickapp-union')) sum.push('quickapp-union');
          if (!sum.includes('quickapp-huawei')) sum.push('quickapp-huawei');
          return sum;
        }
        if (ALL_PLATFORMS[pfm]) sum.push(pfm);
        return sum;
      }, []);

  for (let i = 0; i < platform.length; i++) {
    const pfm = platform[i];
    Log.debug(`check requirements of ${pfm}`);
    Log.info(chalk.bgBlue(`${pfm}:`));

    const { module, dependencies, vue3NotSupport, envs } = ALL_PLATFORMS[pfm];

    // check vue3 support
    if (vue3NotSupport && getModuleVersion(packages, 'vue') >= '3') {
      Log.warn(`Vue3 currently does not support ${pfm}\n`);
      return;
    }

    // check main module of requirement
    if (checkCurrentDirectory || isInstalled(packages, module)) {
      Log.info(`dependencies: ${chalk.cyan(module)} ${chalk.green('installed')}`);
    } else {
      Log.info(`dependencies: ${chalk.cyan(module)} ${chalk.yellow('not installed')}`);
    }

    // check dependencies of requirement
    (dependencies || []).forEach((/** @type {string} */ dependency) => {
      if (isInstalled(packages, dependency)) {
        Log.info(`dependencies: ${chalk.cyan(dependency)} ${chalk.green('installed')}`);
      } else {
        Log.info(`dependencies: ${chalk.cyan(dependency)} ${chalk.yellow('not installed')}`);
      }
    });

    // check environments of requirement
    (envs || []).forEach((/** @type {string} */ env) => {
      if (process.env[env]) {
        Log.info(`env: ${chalk.cyan(env)} ${chalk.green('already set')}`);
      } else {
        Log.info(`env: ${chalk.cyan(env)} ${chalk.yellow('not set yet')}`);
      }
    });
    Log.info();
  }
};
