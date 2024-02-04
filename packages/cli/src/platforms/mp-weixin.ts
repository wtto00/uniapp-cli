import { installPackages, uninstallPackages } from "../utils/exec";
import { isInstalled } from "../utils/package";

const mpWeixin: PlatformModule.ModuleClass = {
  modules: ["@dcloudio/uni-mp-weixin"],

  requirement() {},

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {},
  // isRunSuccessed: (platform, msg, output) => /ready in \d+ms./.test(msg),
  // afterRun(platform, msg, output) {
  //   console.debug("Start open wechat web devTools.");
  //   import("miniprogram-automator").then(({ default: automator }) => {
  //     automator
  //       .launch({
  //         cliPath: process.env.WEIXIN_DEV_TOOL,
  //         projectPath: resolve(process.env.PWD as string, "./dist/dev/mp-weixin"),
  //       })
  //       .then(() => {
  //         console.success("Wechat web devTools has been opened.");
  //       })
  //       .catch(console.error);
  //   });
  // },
};

export default mpWeixin;
