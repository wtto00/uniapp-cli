const { checkIsUniapp, getPackage, getModuleVersion, execShell, detectPackageManager } = require('./util');
const { ALL_PLATFORMS } = require('./const');
const Log = require('./log');

/**
 * Add specified platforms and install them.
 * @param {string[]} platforms Specified platforms
 */
exports.add = function add(platforms) {
  const packages = getPackage();
  checkIsUniapp(packages);

  const uniVersoin = getModuleVersion(packages, '@dcloudio/uni-app');

  for (let i = 0; i < platforms.length; i++) {
    const pfm = platforms[i];
    if (!ALL_PLATFORMS[pfm]) {
      Log.error(`${pfm} is not an valid platform value.\n`);
    } else {
      const { vue3NotSupport, modules } = ALL_PLATFORMS[pfm];
      if (vue3NotSupport && getModuleVersion(packages, 'vue') >= '3') {
        Log.error(`Vue3 currently does not support ${pfm}\n`);
      } else {
        if (!uniVersoin) {
          Log.error(`Cannot get version of uniapp.`);
        } else {
          Log.debug(`start installing module: ${modules.join(' ')}`);
          const pm = detectPackageManager();
          let cmd = pm === 'npm' ? `${pm} install` : `${pm} add`;
          execShell(`${cmd} ${modules.map((m) => `${m}@^${uniVersoin}`).join(' ')}`);
        }
      }
    }
  }
};

/**
 * Remove specified platforms.
 * @param {string[]} platforms Specified platforms
 */
exports.rm = function rm(platforms) {
  console.log(platforms);
};

/**
 * List all installed and available platforms
 */
exports.ls = function ls() {
  console.log('List all installed and available platforms');
};
