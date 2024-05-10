import { resolve } from "node:path";
import {
  isInstalled,
  projectRoot,
  installPackages,
  outputRemoveColor,
  spawnExec,
  uninstallPackages,
  Log,
} from "@uniapp-cli/common";
import { existsSync } from "node:fs";
import type { ModuleClass } from "./index.js";

const mpWeixin: ModuleClass = {
  modules: ["@dcloudio/uni-mp-weixin"],

  async requirement() {
    if (process.platform !== "win32" && process.platform !== "darwin") {
      Log.error(`Wechat web devTools is not supported on ${process.platform}`);
      return;
    }

    if (process.env.WEIXIN_DEV_TOOL) {
      if (existsSync(process.env.WEIXIN_DEV_TOOL)) {
        Log.success(`${Log.emoji.success} Dev tools is installed.`);
        return;
      }
    }
    const defaultPath =
      process.platform === "win32"
        ? "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"
        : "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";
    if (!existsSync(defaultPath)) {
      Log.warn(
        `${Log.emoji.fail} Dev tools is not installed.\n   If it's already installed, please set the environment variable \`WEIXIN_DEV_TOOL\` to the location of the \`cli\` executable file.`
      );
      return;
    }
    Log.success(`${Log.emoji.success} Dev tools is installed.`);
  },

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run(options) {
    let success = false;
    let over = false;
    let output: string[] = [];
    spawnExec(`npx uni -p mp-weixin`, (msg) => {
      if (options.open === false) return;
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms\./.test(msg);
      if (!success) return;
      Log.debug("Start open wechat web devTools.");
      import("miniprogram-automator").then(({ default: automator }) => {
        automator
          .launch({
            cliPath: process.env.WEIXIN_DEV_TOOL,
            projectPath: resolve(projectRoot, "./dist/dev/mp-weixin"),
          })
          .then(() => {
            Log.success("Wechat web devTools has been opened.");
          })
          .catch(Log.error);
      });
      over = true;
    });
  },

  build(options) {
    let success = false;
    let over = false;
    let output: string[] = [];
    spawnExec(`npx uni build -p mp-weixin`, (msg) => {
      if (options.open === false) return;
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms./.test(msg);
      if (!success) return;
      Log.debug("Start open wechat web devTools.");
      import("miniprogram-automator").then(({ default: automator }) => {
        automator
          .launch({
            cliPath: process.env.WEIXIN_DEV_TOOL,
            projectPath: resolve(projectRoot, "./dist/dev/mp-weixin"),
          })
          .then(() => {
            Log.success("Wechat web devTools has been opened.");
          })
          .catch(Log.error);
      });
      over = true;
    });
  },
};

export default mpWeixin;
