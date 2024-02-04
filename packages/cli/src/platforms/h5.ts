import { installPackages, uninstallPackages } from "../utils/exec";
import { isInstalled } from "../utils/package";

const h5: PlatformModule.ModuleClass = {
  modules: ["@dcloudio/uni-h5"],

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
  // afterRun: (platform, msg, output) => {
  //   const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
  //   const line = output.find((l) => regex.test(l));
  //   if (line) {
  //     const url = line.match(regex)?.[1];
  //     if (url) {
  //       import("open").then(({ default: open }) => open(url));
  //     }
  //   }
  // },
};

export default h5;
