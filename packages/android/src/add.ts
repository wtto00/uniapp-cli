import { Log, getManifestJson } from "@uniapp-cli/common";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { androidDir, currentDir } from "./common.js";
import { resolve } from "node:path";

export default async function add() {
  const manifest = getManifestJson();

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

  if (existsSync(androidDir)) {
    throw Error(
      "The android platform has been added, please execute `uniapp platform rm android` to remove the android platform."
    );
  }
  mkdirSync(androidDir, { recursive: true });

  const templateDir = resolve(currentDir, "../template");
  // copy files
  const files = [
    "settings.gradle",
    "gradlew.bat",
    "gradlew",
    "gradle.properties",
    "build.gradle",
    "gradle",
    "app/proguard-rules.pro",
    "app/libs/lib.5plus.base-release.aar",
    "app/libs/android-gif-drawable-1.2.28.aar",
    "app/libs/uniapp-v8-release.aar",
    "app/libs/oaid_sdk_1.0.25.aar",
    "app/libs/install-apk-release.aar",
    "app/libs/breakpad-build-release.aar",
    "app/src/main/assets/data",
    "app/src/main/res/drawable-xxhdpi",
  ];
  files.forEach((file) => {
    cpSync(resolve(templateDir, file), resolve(androidDir, file), { recursive: true });
  });
}
