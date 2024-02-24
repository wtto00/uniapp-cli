import { installPackages, uninstallPackages } from "../utils/exec.js";
import { isInstalled } from "../utils/package.js";

const mpJD: UniappCli.ModuleClass = {
  modules: ["@dcloudio/uni-mp-jd"],

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

export default mpJD;
