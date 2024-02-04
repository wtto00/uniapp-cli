import { installPackages, uninstallPackages } from "../utils/exec";
import { getModuleVersion, isInstalled } from "../utils/package";

const mp360: PlatformModule.ModuleClass = {
  modules: ["@dcloudio/uni-mp-360"],

  requirement() {},

  async platformAdd({ packages, version }) {
    const vueVersion = await getModuleVersion(packages, "vue");
    if (vueVersion >= "3") {
      console.error(`Vue3 currently does not support "mp-360"`);
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

export default mp360;
