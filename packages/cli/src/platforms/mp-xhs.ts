import { installPackages, uninstallPackages } from "../utils/exec";
import { getModuleVersion, isInstalled } from "../utils/package";

const mpXHS: PlatformModule.ModuleClass = {
  modules: ["@dcloudio/uni-mp-xhs"],

  requirement() {},

  async platformAdd({ packages, version }) {
    const vueVersion = await getModuleVersion(packages, "vue");
    if (vueVersion >= "3") {
      console.error(`Vue3 currently does not support "mp-xhs"`);
    } else {
      installPackages(this.modules.map((m) => `${m}@${version}`));
    }
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {},
};

export default mpXHS;
