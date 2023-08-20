const { resolve } = require('path');
const Log = require('./log');
const { getPackage, isInstalled, checkIsUniapp, getModuleVersion } = require('./util');
const chalk = require('chalk');
const { ALL_PLATFORMS } = require('./const');

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
    ? allPlatforms.filter((/** @type {Platform} */ pfm) =>
        (ALL_PLATFORMS[pfm].modules || []).every((module) => isInstalled(packages, module)),
      )
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
    Log.info(chalk.blue.bold(`${pfm}:`));

    const { vue3NotSupport, envs } = ALL_PLATFORMS[pfm];

    // check vue3 support
    if (vue3NotSupport && getModuleVersion(packages, 'vue') >= '3') {
      Log.warn(`Vue3 currently does not support ${pfm}\n`);
      return;
    }

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
