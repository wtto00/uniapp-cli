const chalk = require('chalk');

/**
 * 打印日志内容
 */
module.exports = class Log {
  /**
   * @param  {...string} props
   */
  static info(...props) {
    console.log(...props);
  }

  /**
   * @param  {...string} props
   */
  static warn(...props) {
    console.log(...props.map((item) => chalk.yellow(item)));
  }

  /**
   * @param  {...string} props
   */
  static error(...props) {
    console.log(...props.map((item) => chalk.red(item)));
  }

  /**
   * @param  {...string} props
   */
  static debug(...props) {
    if (process.uniapp?.verbose) console.log(...props.map((item) => chalk.gray(item)));
  }
};
