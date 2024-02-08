import { resolve } from "path";
import { installPackages, outputRemoveColor, spawnExec, uninstallPackages } from "../utils/exec";
import { isInstalled } from "../utils/package";
import { existsSync } from "fs";

const mpWeixin: UniappCli.ModuleClass = {
  modules: ["@dcloudio/uni-mp-weixin"],

  async requirement() {
    if (process.platform !== "win32" && process.platform !== "darwin") {
      console.error(`Wechat web devTools is not supported on ${process.platform}`);
      return;
    }
    if (process.env.WEIXIN_DEV_TOOL) {
      if (existsSync(process.env.WEIXIN_DEV_TOOL)) {
        console.success("Dev tools is installed.");
        return;
      }
    }
    const defaultPath =
      process.platform === "win32"
        ? "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"
        : "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";
    if (existsSync(defaultPath)) {
      console.warn("Dev tools is not installed.");
      return;
    }
    console.success("Dev tools is installed.");
  },

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {
    let success = false;
    let over = false;
    let output: string[] = [];
    spawnExec(`npx uni -p mp-weixin`, { stdio: "pipe", shell: true }, (msg) => {
      console.log(msg.substring(0, msg.length - 1));
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms./.test(msg);
      if (!success) return;
      console.debug("Start open wechat web devTools.");
      import("miniprogram-automator").then(({ default: automator }) => {
        automator
          .launch({
            cliPath: process.env.WEIXIN_DEV_TOOL,
            projectPath: resolve(process.env.PWD as string, "./dist/dev/mp-weixin"),
          })
          .then(() => {
            console.success("Wechat web devTools has been opened.");
          })
          .catch(console.error);
      });
      over = true;
    });
  },
};

export default mpWeixin;
