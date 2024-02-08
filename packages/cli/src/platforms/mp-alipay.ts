import { installPackages, uninstallPackages } from "../utils/exec";
import { isInstalled } from "../utils/package";

const mpAlipay: UniappCli.ModuleClass = {
  modules: ["@dcloudio/uni-mp-alipay"],

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

export default mpAlipay;
