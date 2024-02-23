import chalk from "chalk";
import { importPlatform } from "./platforms";
import { checkIsUniapp, getModuleVersion, getPackage, isInstalled } from "./utils/package";
import { PLATFORM, allPlatforms } from "./utils/platform";

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const uniVersoin = await getModuleVersion(packages, "@dcloudio/uni-app");

  if (!uniVersoin) {
    process.Log.error("Cannot get version of uniapp.");
    process.exit(-3);
  }

  for (const pfm of platforms) {
    if (!allPlatforms.includes(pfm)) {
      process.Log.error(`${pfm} is not an valid platform value.\n`);
      continue;
    }

    const module = await importPlatform(pfm);

    await module.platformAdd({ packages, version: uniVersoin });
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  for (const pfm of platforms) {
    process.Log.debug(`remove platform: ${pfm}`);
    if (!allPlatforms.includes(pfm)) {
      process.Log.error(`${pfm} is not an valid platform value.\n`);
      continue;
    }
    const module = await importPlatform(pfm);
    await module.platformRemove({ packages });
  }
}

/**
 * list platforms
 */
export async function list() {
  const packages = await getPackage();
  checkIsUniapp(packages);

  for (const pfm of allPlatforms) {
    const module = await importPlatform(pfm);
    const space = Array.from(Array(16 - pfm.length))
      .map(() => " ")
      .join("");
    const isPfmInstalled = module.modules.every((module) => isInstalled(packages, module));
    process.Log.info([
      { msg: `${pfm}:${space}` },
      isPfmInstalled
        ? { msg: `${process.Log.emoji.success} Installed`, type: "success" }
        : { msg: `${process.Log.emoji.fail} Not installed`, type: "warn" },
    ]);
  }
}
