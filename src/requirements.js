const { resolve } = require('path');
const Log = require('./log');
const { getPackage, isInstalled, checkIsUniapp, getModuleVersion } = require('./util');
const chalk = require('chalk');

/**
 * @type {Record<Platform,PlatformConfig>}>}
 */
const ALL_PLATFORMS = {
  android: {
    module: '@dcloudio/uni-app-plus',
    dependencies: ['uniapp-android'],
  },
  ios: {
    module: '@dcloudio/uni-app-plus',
    dependencies: ['uniapp-ios'],
  },
  h5: {
    module: '@dcloudio/uni-h5',
  },
  'mp-weixin': {
    module: '@dcloudio/uni-mp-weixin',
  },
  'mp-alipay': {
    module: '@dcloudio/uni-mp-alipay',
  },
  'mp-baidu': { module: '@dcloudio/uni-mp-baidu' },
  'mp-toutiao': { module: '@dcloudio/uni-mp-toutiao' },
  'mp-lark': { module: '@dcloudio/uni-mp-lark' },
  'mp-qq': { module: '@dcloudio/uni-mp-qq' },
  'mp-kuaishou': { module: '@dcloudio/uni-mp-kuaishou' },
  'mp-jd': { module: '@dcloudio/uni-mp-jd' },
  'mp-360': { module: '@dcloudio/uni-mp-360', vue3NotSupport: true },
  'mp-xhs': { module: '@dcloudio/uni-mp-xhs', vue3NotSupport: true },
  'quickapp-union': { module: '@dcloudio/uni-quickapp-webview' },
  'quickapp-huawei': { module: '@dcloudio/uni-quickapp-webview' },
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

    const { module, dependencies, vue3NotSupport } = ALL_PLATFORMS[pfm];

    if (vue3NotSupport && getModuleVersion(packages, 'vue') >= '3') {
      Log.warn(`Vue3 currently does not support ${pfm}\n`);
      return;
    }

    if (checkCurrentDirectory || isInstalled(packages, module)) {
      Log.info(`dependencies: ${chalk.cyan(module)} ${chalk.green('installed')}`);
    } else {
      Log.info(`dependencies: ${chalk.cyan(module)} ${chalk.yellow("not installed")}`);
    }

    if ((dependencies || []).length > 0) {
      dependencies.forEach((/** @type {string} */ dependency) => {
        if (isInstalled(packages, dependency)) {
          Log.info(`dependencies: ${chalk.cyan(dependency)} ${chalk.green('installed')}`);
        } else {
          Log.info(`dependencies: ${chalk.cyan(dependency)} ${chalk.yellow("not installed")}`);
        }
      });
    }
    Log.info();
  }
};
