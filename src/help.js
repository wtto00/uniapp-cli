const { log } = require("./util");
const { version } = require("../package.json");

module.exports = async function help() {
  log(`uniapp-cli@${version}
  
摘要

    uniapp command [options]

命令
    create ............................. 创建一个 uniapp 项目

选项
    -h, --help ......................... 获取帮助信息
    -v, --version ...................... 打印 uniapp-cli 的版本
    -d, --verbose ...................... 调试模式，打印所有活动日志
    
示例
    uniapp create vite-ts my-vue3-project`);
};
