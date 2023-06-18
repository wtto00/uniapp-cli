/**
 * 打印输出
 * @param {string} msg 打印输出e内容
 * @param {boolean} [verbose] 是否是debug模式
 */
function log(msg, verbose) {
  if (!verbose) console.log(msg);
  const cmd = process.argv.slice(2);
  if (cmd.includes("-d") || cmd.includes("--verbose")) {
    console.log(`%c${msg}`, "color: #ccc");
  }
}
exports.log = log;

/**
 * 执行shell命令
 * @param {string} command shell命令
 * @param {ChildProcess.StdioOptions} stdio 输出方式
 * @returns
 */
function execShell(command, stdio = "inherit") {
  log(command, true);
  const { spawnSync } = require("node:child_process");
  const res = spawnSync(command, {
    encoding: "utf8",
    shell: true,
    stdio: stdio,
  });
  if (res.status !== 0) {
    process.exit(-1);
  }
  return res;
}
exports.execShell = execShell;
