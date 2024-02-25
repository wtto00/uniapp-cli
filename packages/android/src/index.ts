import { getManifestJson } from "@uniapp-cli/common";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { projectRoot } from "@uniapp-cli/common";
import { fileURLToPath } from "node:url";
import { buildAndroidManifest, buildBuildGradle } from "./build-files.js";

export const currentDir = fileURLToPath(new URL("./", import.meta.url));
export const androidDir = resolve(projectRoot, "platform/android");

export async function add() {
  try {
    const manifest = getManifestJson();

    if (!manifest) throw Error();
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
          process.Log.warn(`Please set \`${field}\` in \`src/manifest.json\`.`);
          isFailed = true;
        } else {
          val = val[item];
        }
      });
    });
    if (isFailed) throw Error();

    if (existsSync(androidDir)) {
      process.Log.warn("Directory `platform/android` already exists.");
      throw Error();
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
      "android.iml",
      "app/proguard-rules.pro",
      "app/app.iml",
      "app/libs/android-gif-drawable-release@1.2.23.aar",
      "app/libs/breakpad-build-release.aar",
      "app/libs/lib.5plus.base-release.aar",
      "app/libs/oaid_sdk_1.0.25.aar",
      "app/libs/uniapp-v8-release.aar",
      "app/libs/install-apk-release.aar",
    ];
    files.forEach((file) => {
      cpSync(resolve(templateDir, file), resolve(androidDir, file), { recursive: true });
    });

    // app/build.gradle
    const buildGradlePath = resolve(androidDir, "app/build.gradle");
    const gradleStr = buildBuildGradle(manifest);
    writeFileSync(buildGradlePath, gradleStr, { encoding: "utf8" });

    // AndroidManifest.xml
    const androidManifestPath = resolve(androidDir, "app/src/main/AndroidManifest.xml");
    mkdirSync(resolve(androidDir, "app/src/main"), { recursive: true });
    const androidManifestStr = buildAndroidManifest(manifest);
    writeFileSync(androidManifestPath, androidManifestStr, { encoding: "utf8" });
  } catch (error) {
    return Promise.reject();
  }
}

export function remove() {
  rmSync(androidDir, { recursive: true, force: true });
}
