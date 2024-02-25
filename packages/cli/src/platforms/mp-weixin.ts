import { resolve } from "node:path";
import {
  isInstalled,
  projectRoot,
  installPackages,
  outputRemoveColor,
  spawnExec,
  uninstallPackages,
} from "@uniapp-cli/common";
import { existsSync } from "node:fs";
import type { ModuleClass } from "./index.js";

const mpWeixin: ModuleClass = {
  modules: ["@dcloudio/uni-mp-weixin"],

  async requirement() {
    if (process.platform !== "win32" && process.platform !== "darwin") {
      process.Log.error(`Wechat web devTools is not supported on ${process.platform}`);
      return;
    }

    if (process.env.WEIXIN_DEV_TOOL) {
      if (existsSync(process.env.WEIXIN_DEV_TOOL)) {
        process.Log.success(`${process.Log.emoji.success} Dev tools is installed.`);
        return;
      }
    }
    const defaultPath =
      process.platform === "win32"
        ? "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"
        : "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";
    if (!existsSync(defaultPath)) {
      process.Log.warn(
        `${process.Log.emoji.fail} Dev tools is not installed.\n   If it's already installed, please set the environment variable \`WEIXIN_DEV_TOOL\` to the location of the \`cli\` executable file.`
      );
      return;
    }
    process.Log.success(`${process.Log.emoji.success} Dev tools is installed.`);
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
      process.Log.info(msg.substring(0, msg.length - 1));
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms./.test(msg);
      if (!success) return;
      process.Log.debug("Start open wechat web devTools.");
      import("miniprogram-automator").then(({ default: automator }) => {
        automator
          .launch({
            cliPath: process.env.WEIXIN_DEV_TOOL,
            projectPath: resolve(projectRoot, "./dist/dev/mp-weixin"),
          })
          .then(() => {
            process.Log.success("Wechat web devTools has been opened.");
          })
          .catch(process.Log.error);
      });
      over = true;
    });
  },
};

export default mpWeixin;
