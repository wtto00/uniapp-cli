const { log } = require("../util");

module.exports = async function help() {
  log(`摘要

    uniapp create [TYPE] [NAME] [options]

创建一个 uniapp 项目
    TYPE ............................. uniapp类型，值为其中之一: stable, alpha, vite, vite-ts，参见https://uniapp.dcloud.net.cn/quickstart-cli.html
    NAME ............................. 项目名称

选项
    -d, --verbose ...................... 调试模式，打印所有活动日志`);
};
