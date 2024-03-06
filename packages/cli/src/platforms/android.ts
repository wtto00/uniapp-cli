import { isInstalled, installPackages, uninstallPackages, getPackageJson, projectRoot } from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";
import { resolve } from "path";
import { existsSync } from "fs";

const android: ModuleClass = {
  modules: ["@dcloudio/uni-app-plus", "uniapp-android"],

  requirement() {},

  async platformAdd({ version, packages }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
    const newPackages = await getPackageJson();
    for (const module of this.modules) {
      if (!isInstalled(newPackages, module)) {
        process.Log.error(`Module \`${module}\` is not installed.`);
        return;
      }
    }
    const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/index.js");
    if (!existsSync(scriptPath)) {
      process.Log.error("File `node_modules/uniapp-android/dist/index.js` not found.");
      return;
    }
    const { add } = await import("file://" + scriptPath);
    const result = await add();
    if (!result) {
      process.Log.error(`${process.Log.emoji.fail} failed to add platform \`android\`.`);
    }
  },

  async platformRemove({ packages }) {
    if (isInstalled(packages, "uniapp-android")) {
      const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/index.js");
      if (existsSync(scriptPath)) {
        const { remove } = await import("file://" + scriptPath);
        remove();
      }
    }
    uninstallPackages(["uniapp-android"]);
  },

  run() {},

  build() {},
};

export default android;
