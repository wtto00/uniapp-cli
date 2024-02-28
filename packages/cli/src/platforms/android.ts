import { isInstalled, installPackages, uninstallPackages } from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";

const android: ModuleClass = {
  modules: ["@dcloudio/uni-app-plus", "uniapp-android"],

  requirement() {},

  async platformAdd({ version, packages }) {
    try {
      installPackages(this.modules.map((m) => `${m}@${version}`));
      const { add } = await import("uniapp-android");
      add();
    } catch (error) {
      process.Log.error(`${process.Log.emoji.fail} failed to add platform \`android\`.`);
      process.Log.debug("Undo operations.");
      this.platformRemove({ packages });
    }
  },

  async platformRemove({ packages }) {
    const { remove } = await import("uniapp-android");
    remove();
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {},

  build() {},
};

export default android;
