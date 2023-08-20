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
    (packages.devDependencies || {})[module] ||
    (packages.optionalDependencies || {})[module] ||
    (packages.peerDependencies || {})[module]
  );
}
exports.isInstalled = isInstalled;

/**
 * check current directory is a uniapp project or not
 * @param {Packages} packages
 */
function checkIsUniapp(packages) {
  if (!isInstalled(packages, '@dcloudio/uni-app')) {
    Log.error('Current working directory is not a Uniapp-based project.');
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
    Log.warn('Please run `npm install` first!');
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

/**
 * @param {string} cmd
 * @param {import('node:child_process').CommonSpawnOptions['stdio']?} stdio
 */
function execShell(cmd, stdio = 'inherit') {
  const { spawnSync } = require('node:child_process');
  Log.info(cmd);
  const res = spawnSync(cmd, {
    encoding: 'utf8',
    shell: true,
    stdio: stdio,
  });
  if (res.status !== 0) {
    process.exit(-1000);
  }
  return res;
}
exports.execShell = execShell;

/**
 * detect package manager is pnpm yarn or npm
 * @returns {'pnpm'|'yarn'|'npm'}
 */
function detectPackageManager() {
  if (existsSync(resolve('./pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve('./yarn.lock'))) return 'yarn';
  return 'npm';
}
exports.detectPackageManager = detectPackageManager;
