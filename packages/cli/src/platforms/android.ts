import { isInstalled, projectRoot, installPackages, uninstallPackages } from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";
import { resolve } from "path";

const android: ModuleClass = {
  modules: ["@dcloudio/uni-app-plus", "@uniapp-cli/android"],

  requirement() {},

  async platformAdd({ version, packages }) {
    try {
      // installPackages(this.modules.map((m) => `${m}@${version}`));
      installPackages([`@dcloudio/uni-app-plus@${version}`, "@uniapp-cli/android@file:../packages/android"]);
      // const android = await import("file://" + resolve(projectRoot, "node_modules/@uniapp-cli/android/dist/index.js"));
      // await android.add();
    } catch (error) {
      process.Log.error(`${process.Log.emoji.fail} failed to add platform \`android\`.`);
      process.Log.debug("Undo operations.");
      this.platformRemove({ packages });
    }
  },

  platformRemove({ packages }) {
    import("file://" + resolve(projectRoot, "node_modules/@uniapp-cli/android/dist/index.js")).then(({ remove }) => {
      void remove();
    });
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {},
};

export default android;
