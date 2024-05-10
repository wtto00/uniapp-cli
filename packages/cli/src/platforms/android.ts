import {
  isInstalled,
  installPackages,
  uninstallPackages,
  getPackageJson,
  projectRoot,
  spawnExecSync,
  spawnExec,
  Log,
  androidPath,
} from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";
import { resolve } from "path";
import { existsSync, rmSync } from "fs";
import Android from "@wtto00/android-tools";
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
    const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/add.js");
    if (!existsSync(scriptPath)) {
      Log.error("File `node_modules/uniapp-android/dist/index.js` not found.");
      return;
    }
    spawnExecSync(`node ${scriptPath}`, { stdio: "inherit" });
  },

  async platformRemove({ packages }) {
    if (isInstalled(packages, "uniapp-android")) {
      const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/remove.js");
      if (existsSync(scriptPath)) {
        spawnExecSync(`node ${scriptPath}`, { stdio: "inherit" });
      }
    }
    uninstallPackages(["uniapp-android"]);
  },

  run(options) {
    const { debug, release, device, emulator, list, target, open } = options;
    const isRelease = release || debug == false;
    let success = false;
    const android = new Android();
    const uniappProc = spawnExec(`npx uni -p app-android`, (msg) => {
      success ||= /ready in \d+ms\./.test(msg);
      const doneChange = /DONE  Build complete\. Watching for changes\.\.\./.test(msg);
      if (!doneChange && !success) return;

      Log.info("\nstart build android:");

      const scriptPath = resolve(projectRoot, "node_modules/uniapp-android/dist/run.js");
      if (!existsSync(scriptPath)) {
        Log.error(`File \`${scriptPath}\` does't exist.`);
        return;
      }
      const proc = spawnExecSync(`node ${scriptPath}`, { stdio: "inherit" });
      if (proc.stderr?.trim()) {
        Log.error(proc.stderr.trim());
        uniappProc.kill();
        return;
      }
      const isWin = process.platform === "win32";
      const gradleExePath = resolve(projectRoot, `${androidPath}/gradlew${isWin ? ".bat" : ""}`);
      if (!existsSync(gradleExePath)) {
        Log.error(`File \`${gradleExePath}\` does\'t exist.`);
        uniappProc.kill();
        return;
      }
      const apkPath = `${androidPath}/app/build/outputs/apk/${
        isRelease ? "release/app-release.apk" : "debug/app-debug.apk"
      }`;
      rmSync(resolve(projectRoot, apkPath), { force: true });
      process.chdir(resolve(projectRoot, androidPath));
      spawnExecSync(`${isWin ? "cmd" : "sh"} ${gradleExePath} ${isRelease ? "assembleRelease" : "assembleDebug"}`, {
        stdio: "inherit",
      });
      if (proc.stderr?.trim()) {
        Log.error(proc.stderr.trim());
        uniappProc.kill();
        return;
      }
      if (!existsSync(resolve(projectRoot, apkPath))) {
        Log.error("Build failed.");
        uniappProc.kill();
        return;
      }
      Log.success(`Build success: ${apkPath}`);
      if (open == false) return;
      if (device) {
        // adb install to device
        android
          .devices()
          .then((res) => {
            console.log("avds", res);
            const devices = res.filter((item) => item.status === "device");
            if (devices.length == 0) {
              Log.warn("No device connected");
              return;
            }
            android
              .install(devices[0].name, apkPath, { r: true })
              .then(() => {
                Log.success(`Deploy ${apkPath} to ${devices[0].name} successfully.`);
              })
              .catch(Log.error);
          })
          .catch(Log.error);
        return;
      }
      if (emulator) {
        // adb install to emulator
        return;
      }
      if (list) {
        // let user to choose device
        return;
      }
      if (target) {
        // adb install to special target
        return;
      }
    });
  },

  build() {},
};

export default android;
