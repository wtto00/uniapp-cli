import { Log, androidPath, getManifestJson, spawnExecSync } from "@uniapp-cli/common";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { androidDir } from "./common.js";
import { resolve } from "node:path";
import { buildAndroidManifest, buildBuildGradle } from "./build-files.js";
import Android from "@wtto00/android-tools";

interface RunOptions {
  open: boolean;
  debug?: boolean;
  release?: boolean;
  device?: boolean;
  emulator?: boolean;
  list?: boolean;
  target?: string;
}

const android = new Android();

export default async function run(options: RunOptions) {
  const manifest = getManifestJson();

  if (!manifest) {
    throw Error("Failed to parse manifest.json.");
  }
  // require these field in src/manifest.json before platform add
  const reuiqreFields = [
    "name",
    "appid",
    "app-plus.distribute.android.packagename",
    "app-plus.distribute.android.keystore",
    "app-plus.distribute.android.password",
    "app-plus.distribute.android.aliasname",
    "app-plus.distribute.android.dcloud_appkey",
  ];

  let isFailed = false;
  reuiqreFields.forEach((field) => {
    const arr = field.split(".");
    let val = manifest;
    arr.forEach((item) => {
      if (!val[item]) {
        Log.warn(`Please set \`${field}\` in \`src/manifest.json\`.`);
        isFailed = true;
      } else {
        val = val[item];
      }
    });
  });
  if (isFailed) {
    throw Error("Some fields are missing in `src/manifest.json`.");
  }

  if (!existsSync(androidDir)) {
    throw Error(
      "The android platform has not been added yet. Please execute `uniapp platform add android` to add the android platform."
    );
    return false;
  }

  // app/build.gradle
  const buildGradlePath = resolve(androidDir, "app/build.gradle");
  const gradleStr = buildBuildGradle(manifest);
  writeFileSync(buildGradlePath, gradleStr, { encoding: "utf8" });

  // AndroidManifest.xml
  const androidManifestPath = resolve(androidDir, "app/src/main/AndroidManifest.xml");
  mkdirSync(resolve(androidDir, "app/src/main"), { recursive: true });
  const androidManifestStr = buildAndroidManifest(manifest);
  writeFileSync(androidManifestPath, androidManifestStr, { encoding: "utf8" });

  // appid dir
  const wwwDir = resolve(androidDir, `app/src/main/assets/apps/${manifest.appid}`);
  if (existsSync(wwwDir)) {
    rmSync(wwwDir, { recursive: true });
  }
  mkdirSync(wwwDir, { recursive: true });

  cpSync(resolve(global.projectRoot, "dist/dev/app"), wwwDir, { recursive: true });

  const { debug, release, device, emulator, list, target, open } = options;

  const isRelease = release || debug == false;

  const isWin = process.platform === "win32";
  const gradleExePath = resolve(global.projectRoot, `${androidPath}/gradlew${isWin ? ".bat" : ""}`);
  if (!existsSync(gradleExePath)) {
    throw Error(`File \`${gradleExePath}\` does\'t exist.`);
  }
  const apkPath = `${androidPath}/app/build/outputs/apk/${
    isRelease ? "release/app-release.apk" : "debug/app-debug.apk"
  }`;
  rmSync(resolve(global.projectRoot, apkPath), { force: true });
  process.chdir(resolve(global.projectRoot, androidPath));
  const proc = spawnExecSync(
    `${isWin ? "cmd" : "sh"} ${gradleExePath} ${isRelease ? "assembleRelease" : "assembleDebug"}`,
    { stdio: "inherit" }
  );
  if (proc.stderr?.trim()) {
    throw Error(proc.stderr.trim());
  }
  if (!existsSync(resolve(global.projectRoot, apkPath))) {
    throw Error("Build failed.");
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
}
