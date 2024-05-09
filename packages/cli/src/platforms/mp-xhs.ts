import { getModuleVersion, isInstalled, installPackages, uninstallPackages, Log } from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";

const mpXHS: ModuleClass = {
  modules: ["@dcloudio/uni-mp-xhs"],

  async requirement({ packages }) {
    const vueVersion = await getModuleVersion(packages, "vue");
    if (vueVersion >= "3") {
      Log.error(`Vue3 currently does not support "mp-360"`);
    }
  },

  async platformAdd({ packages, version }) {
    const vueVersion = await getModuleVersion(packages, "vue");
    if (vueVersion >= "3") {
      Log.error(`Vue3 currently does not support "mp-xhs"`);
    } else {
      installPackages(this.modules.map((m) => `${m}@${version}`));
    }
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {},

  build() {},
};

export default mpXHS;
