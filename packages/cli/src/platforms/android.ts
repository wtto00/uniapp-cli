import {
  isInstalled,
  installPackages,
  uninstallPackages,
  getPackageJson,
  spawnExecSync,
  spawnExec,
  Log,
  dynamicImport,
  killChildProcess,
} from "@uniapp-cli/common";
import { type BuildOptions, type ModuleClass } from "./index.js";
import { resolve } from "path";
import { existsSync } from "fs";
import { getOutput } from "@uniapp-cli/common";

const android: ModuleClass = {
  modules: ["@dcloudio/uni-app-plus", "uniapp-android"],

  requirement() {
    // JAVA_HOME
    if (process.env.JAVA_HOME) {
      const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === "win32" ? ".exe" : ""}`);
      if (existsSync(javaBinPath)) {
        const res = getOutput(spawnExecSync(`${javaBinPath} -version`));
        const version = res.split("\n")[0];
        Log.success(`${Log.emoji.success} ${version}`);
      } else {
        Log.warn(`${Log.emoji.fail} Java exec bin file is not exists.`);
      }
    } else {
      Log.warn(`${Log.emoji.fail} JAVA_HOME is not set.`);
    }
    // ANDROID_HOME
    if (process.env.ANDROID_HOME) {
      Log.success(`${Log.emoji.success} ANDROID_HOME=${process.env.ANDROID_HOME}`);
    } else {
      Log.warn(`${Log.emoji.fail} ANDROID_HOME is not set.`);
    }
  },

  async platformAdd({ version, packages }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
    const newPackages = await getPackageJson();
    for (const module of this.modules) {
      if (!isInstalled(newPackages, module)) {
        Log.error(`Module \`${module}\` is not installed.`);
        return;
      }
    }
    const scriptPath = resolve(global.projectRoot, "node_modules/uniapp-android/dist/add.js");
    if (!existsSync(scriptPath)) {
      Log.error("File `node_modules/uniapp-android/dist/add.js` not found.");
      return;
    }

    const addAndroid = await dynamicImport<() => Promise<void>>(scriptPath);

    try {
      addAndroid();
      Log.success("Patform android has been added successfully.");
    } catch (error) {
      Log.error((error as Error).message);
    }
  },

  async platformRemove({ packages }) {
    if (isInstalled(packages, "uniapp-android")) {
      const scriptPath = resolve(global.projectRoot, "node_modules/uniapp-android/dist/remove.js");
      if (existsSync(scriptPath)) {
        const removeAndroid = await dynamicImport<() => void>(scriptPath);
        try {
          removeAndroid();
        } catch (error) {
          Log.error((error as Error).message);
        }
      }
    }
    uninstallPackages(["uniapp-android"]);
  },

  run(options) {
    let deviceName = "";
    let runKey = 0;

    async function refreshAndroid(refresh: () => Promise<void>) {
      if (runKey === 1) {
        runKey = 2;
        await refresh();
        await refreshAndroid(refresh);
      } else if (runKey === 2) {
        runKey = 0;
      }
    }

    const uniappProcess = spawnExec(`npx uni -p app-android`, async (msg) => {
      const doneChange = /DONE  Build complete\. Watching for changes\.\.\./.test(msg);
      if (!doneChange) return;

      Log.info("\nstart build android:");

      const scriptPath = resolve(global.projectRoot, "node_modules/uniapp-android/dist/run.js");
      if (!existsSync(scriptPath)) {
        Log.error(`File \`${scriptPath}\` does't exist.`);
        killChildProcess(uniappProcess);
        return;
      }

      if (runKey) {
        // mark refresh
        runKey = 1;
        return;
      } else {
        // mark building
        runKey = 2;
      }
      const runModule = await dynamicImport<{
        run: (options: BuildOptions) => Promise<string>;
        refresh: (deviceName: string) => Promise<void>;
      }>(scriptPath, true);

      try {
        if (!deviceName) {
          deviceName = await runModule.run(options);
        } else {
          await runModule.refresh(deviceName);
        }
        await refreshAndroid(() => runModule.refresh(deviceName));
      } catch (error) {
        Log.error((error as Error).message);
        killChildProcess(uniappProcess);
      }
    });
  },

  build() {},
};

export default android;
