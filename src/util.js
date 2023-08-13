const { existsSync } = require('fs');
const { resolve } = require('path');
const Log = require('./log');

/**
 * 判断当前目录是否是uniapp项目
 * @param {boolean} [willLog] 是否打印结果
 * @returns {boolean}
 */
exports.isUniapp = function (willLog) {
  const log = willLog ? Log.warn : Log.debug;
  const currentPath = resolve('./');
  const uniBinFile = resolve(currentPath, './node_modules/.bin/uni');
  if (!existsSync(uniBinFile)) {
    log('Current working directory is not a uniapp-based project.');
    return false;
  }
  return true;
};
