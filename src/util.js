const { existsSync } = require('fs');
const { resolve } = require('path');
const Log = require('./log');

/**
 * get content of package.json
 * @returns {Packages}
 */
function getPackage() {
  const currentPath = resolve('./');
  const packagePath = resolve(currentPath, './package.json');
  if (!existsSync(packagePath)) {
    Log.error("Current working directory does't have a package.json file.");
    process.exit(-1);
  }
  try {
    return require(packagePath);
  } catch (error) {
    Log.error('Error loading package.json.');
    process.exit(-1);
  }
}
exports.getPackage = getPackage;

/**
 * check module is installed or not
 * @param {Packages} packages
 * @param {string} module
 * @returns {boolean}
 */
function isInstalled(packages, module) {
  return !!(
    (packages.dependencies || {})[module] ||
    (packages.dependencies || {})[module] ||
    (packages.dependencies || {})[module] ||
    (packages.dependencies || {})[module]
  );
}
exports.isInstalled = isInstalled;

/**
 * check current directory is a uniapp project or not
 * @param {Packages} packages
 */
function checkIsUniapp(packages) {
  if (!isInstalled(packages, '@dcloudio/uni-app')) {
    Log.error('Current working directory is not a uniapp-based project.');
    process.exit(-2);
  }
}
exports.checkIsUniapp = checkIsUniapp;

/**
 * get module version
 * @param {Packages} packages
 * @param {string} module
 * @returns {string|undefined}
 */
function getModuleVersion(packages, module) {
  if (!isInstalled(packages, module)) return undefined;
  const modulePackage = resolve(`./node_modules/${module}/package.json`);
  if (!existsSync(modulePackage)) {
    Log.warn('Please run `npm install` first');
    return undefined;
  }
  try {
    const modulePackageJson = require(modulePackage);
    return modulePackageJson.version;
  } catch (error) {
    Log.debug(`Error loading  ${modulePackage}.`);
    return undefined;
  }
}
exports.getModuleVersion = getModuleVersion;
