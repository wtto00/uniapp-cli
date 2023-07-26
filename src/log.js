const chalk = require('chalk');

/**
 * 打印日志内容
 * @param {string} content 打印的内容
 * @param {boolean} [verbose] 是否是 debug 模式才会显示的日志
 */
module.exports = function log(content, verbose) {
  if (!verbose) console.log(content);
  else if (process.uniapp?.verbose) console.log(chalk.gray(content));
};
