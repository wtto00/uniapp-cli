import { Log, ManifestConfig, androidPath, getManifestJson, spawnExecSync } from "@uniapp-cli/common";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { androidDir, getSignConfigEnv } from "./common.js";
import { dirname, resolve } from "node:path";
import { buildAndroidManifest, buildBuildGradle, buildDcloudControlXml, buildStringXml } from "./build-files.js";
import Android from "@wtto00/android-tools";

interface RunOptions {
  debug?: boolean;
  release?: boolean;
}

const android = new Android();

const manifest = getManifestJson();

export async function run(options: RunOptions): Promise<string> {
  if (!manifest) {
    throw Error("Failed to parse manifest.json.");
  }

  // require these field in src/manifest.json before platform add
  const reuiqreFields = [
    "name",
    "appid",
    "app-plus.distribute.android.packagename",
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
  }

  // app/build.gradle
  const buildGradlePath = resolve(androidDir, "app/build.gradle");
  writeFileSync(buildGradlePath, buildBuildGradle(manifest), { encoding: "utf8" });

  // AndroidManifest.xml
  const androidManifestPath = resolve(androidDir, "app/src/main/AndroidManifest.xml");
  writeFileSync(androidManifestPath, buildAndroidManifest(manifest), { encoding: "utf8" });

  // www dir
  const appsDir = resolve(androidDir, "app/src/main/assets/apps");
  if (existsSync(appsDir)) {
    rmSync(appsDir, { recursive: true });
  }
  const wwwDir = resolve(appsDir, `${manifest.appid}/www`);
  cpSync(resolve(global.projectRoot, "dist/dev/app"), wwwDir, { recursive: true });

  // app/src/main/res/values/strings.xml
  const stringXmlPath = resolve(androidDir, "app/src/main/res/values/strings.xml");
  const stringXmlDir = dirname(stringXmlPath);
  if (!existsSync(stringXmlDir)) {
    mkdirSync(stringXmlDir, { recursive: true });
  }
  writeFileSync(stringXmlPath, buildStringXml(manifest), { encoding: "utf8" });

  // app/src/main/assets/data/dcloud_control.xml
  const dcloudControlPath = resolve(androidDir, "app/src/main/assets/data/dcloud_control.xml");
  const dcloudControlDir = dirname(dcloudControlPath);
  if (!existsSync(dcloudControlDir)) {
    mkdirSync(dcloudControlDir, { recursive: true });
  }
  writeFileSync(dcloudControlPath, buildDcloudControlXml(manifest), { encoding: "utf8" });

  const { debug, release } = options;

  const isRelease = release || debug === false;

  const isWin = process.platform === "win32";
  const gradleExePath = resolve(global.projectRoot, `${androidPath}/gradlew${isWin ? ".bat" : ""}`);
  if (!existsSync(gradleExePath)) {
    throw Error(`File \`${gradleExePath}\` does\'t exist.`);
  }
  const apkPath = `${androidPath}/app/build/outputs/apk/${
    isRelease ? "release/app-release.apk" : "debug/app-debug.apk"
  }`;
  const apkFullPath = resolve(global.projectRoot, apkPath);
  rmSync(apkFullPath, { force: true });
  process.chdir(resolve(global.projectRoot, androidPath));
  const proc = spawnExecSync(
    `${isWin ? gradleExePath : `sh ${gradleExePath}`} ${isRelease ? "assembleRelease" : "assembleDebug"}`,
    { stdio: "inherit", env: getSignConfigEnv(manifest, isRelease) }
  );
  if (proc.stderr?.trim()) {
    throw Error(proc.stderr.trim());
  }
  if (!existsSync(apkFullPath)) {
    throw Error("Build failed.");
  }
  Log.success(`Build success: ${apkPath}`);
  const allDevices = await android.devices();
  const devices = allDevices.filter((item) => item.status === "device");
  if (devices.length == 0) {
    throw Error("No device connected");
  }
  const deviceName = devices[0].name;
  Log.debug(`Install ${apkPath} to device \`${deviceName}\``);
  await android.install(deviceName, apkFullPath, { r: true });
  Log.success(`Deploy ${apkPath} to ${deviceName} successfully.`);
  Log.debug("Start opening app");
  await android.adb(
    deviceName,
    `shell am start -n ${manifest["app-plus"].distribute.android.packagename}/io.dcloud.PandoraEntry`
  );
  return deviceName;
}

export async function refresh(deviceName: string, manifest: ManifestConfig) {
  if (!manifest) {
    throw Error("Failed to parse manifest.json.");
  }

  // copy file
  const wwwDir = resolve(androidDir, `app/src/main/assets/apps/${manifest.appid}`);
  if (existsSync(wwwDir)) {
    rmSync(wwwDir, { recursive: true });
  }
  mkdirSync(wwwDir, { recursive: true });

  cpSync(resolve(global.projectRoot, "dist/dev/app"), wwwDir, { recursive: true });

  // adb shell am start -a android.intent.action.VIEW https://example.com/
  return android.adb(deviceName, "shell am refresh");
}
