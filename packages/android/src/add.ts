import { Log, getManifestJson, xmlBuild, xmlParse } from "@uniapp-cli/common";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildAndroidManifest, buildBuildGradle } from "./build-files.js";
import { projectRoot } from "@uniapp-cli/common";
import { fileURLToPath } from "node:url";

const currentDir = fileURLToPath(new URL("./", import.meta.url));
const androidDir = resolve(projectRoot, "platform/android");

async function add() {
  const manifest = getManifestJson();

  if (!manifest) throw Error("Failed to parse manifest.json");
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
  if (isFailed) throw Error("Some fields are missing in `src/manifest.json`.");

  if (existsSync(androidDir)) {
    throw Error("Directory `platform/android` already exists.");
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
    "app/src/main/assets/data/dcloud_error.html",
    "app/src/main/res/drawable-xxhdpi",
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

  // appid dir
  const wwwDir = resolve(androidDir, `app/src/main/assets/apps/${manifest.appid}`);
  mkdirSync(wwwDir, { recursive: true });

  // dcloud_control.xml
  // const dcloudControlPath = "app/src/main/assets/data/dcloud_control.xml";
  // const dcloudControlXml = await xmlParse(resolve(templateDir, dcloudControlPath));
  // dcloudControlXml.hbuilder;
  // console.log(dcloudControlXml);

  // strings.xml
  const stringXmlPath = "app/src/main/res/values/strings.xml";
  mkdirSync(dirname(resolve(androidDir, stringXmlPath)));
  const stringXml = await xmlParse(resolve(templateDir, stringXmlPath));
  const index = (stringXml?.resources?.string || []).findIndex(
    (item: { $: { name: string } }) => item?.$?.name === "app_name"
  );
  if (index > -1) {
    stringXml.resources.string[index]._ = manifest.name;
  }
  xmlBuild(stringXml, resolve(androidDir, stringXmlPath));
}

add();
