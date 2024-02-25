import { isInstalled, installPackages, uninstallPackages } from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";

const mpKuaishou: ModuleClass = {
  modules: ["@dcloudio/uni-mp-kuaishou"],

  requirement() {},

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {},
};

export default mpKuaishou;
