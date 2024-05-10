import { Log, getManifestJson, projectRoot } from "@uniapp-cli/common";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { androidDir } from "./common.js";
import { resolve } from "node:path";
import { buildAndroidManifest, buildBuildGradle } from "./build-files.js";

async function run() {
  const manifest = getManifestJson();

  if (!manifest) {
    Log.warn("Failed to parse manifest.json.");
    return false;
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
    Log.warn("Some fields are missing in `src/manifest.json`.");
    return false;
  }

  if (!existsSync(androidDir)) {
    Log.warn(
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

  cpSync(resolve(projectRoot, "dist/dev/app"), wwwDir, { recursive: true });

  return true;
}

run();
