import {
  isInstalled,
  installPackages,
  uninstallPackages,
  getPackageJson,
  projectRoot,
  spwanSyncExec,
} from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";
import { resolve } from "path";
import { existsSync } from "fs";

const android: ModuleClass = {
  modules: ["@dcloudio/uni-app-plus", "uniapp-android"],

  requirement() {
    // JAVA_HOME
    if (process.env.JAVA_HOME) {
      const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === "win32" ? ".exe" : ""}`);
      if (existsSync(javaBinPath)) {
        const res = spwanSyncExec(`${javaBinPath} -version`);
        const version = res.split("\n")[0];
        process.Log.success(`${process.Log.emoji.success} ${version}`);
      } else {
        process.Log.warn(`${process.Log.emoji.fail} Java exec bin file is not exists.`);
      }
    } else {
      process.Log.warn(`${process.Log.emoji.fail} JAVA_HOME is not set.`);
    }
    // ANDROID_SDK_ROOT
    if (process.env.ANDROID_SDK_ROOT) {
      process.Log.success(`${process.Log.emoji.success} ANDROID_SDK_ROOT=${process.env.ANDROID_SDK_ROOT}`);
    } else {
      process.Log.warn(`${process.Log.emoji.fail} ANDROID_SDK_ROOT is not set.`);
    }
  },

  async platformAdd({ version, packages }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
    const newPackages = await getPackageJson();
    for (const module of this.modules) {
      if (!isInstalled(newPackages, module)) {
        process.Log.error(`Module \`${module}\` is not installed.`);
        return;
      }
    }
    const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/add.js");
    if (!existsSync(scriptPath)) {
      process.Log.error("File `node_modules/uniapp-android/dist/index.js` not found.");
      return;
    }
    spwanSyncExec(`node ${scriptPath}`, { stdio: "inherit" });
  },

  async platformRemove({ packages }) {
    if (isInstalled(packages, "uniapp-android")) {
      const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/remove.js");
      if (existsSync(scriptPath)) {
        spwanSyncExec(`node ${scriptPath}`, { stdio: "inherit" });
      }
    }
    uninstallPackages(["uniapp-android"]);
  },

  run() {},

  build() {},
};

export default android;
