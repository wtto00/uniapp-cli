import { importPlatform, type PLATFORM, allPlatforms } from "./platforms/index.js";
import { checkIsUniapp, getPackageJson, isInstalled, Log } from "@uniapp-cli/common";

export async function requirements(platforms: PLATFORM[]) {
  const packages = await getPackageJson();
  checkIsUniapp(packages);

  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, pfm) => {
    if (allPlatforms.includes(pfm)) prev.push(pfm);
    return prev;
  }, []);

  for (const pfm of validPlatforms) {
    Log.debug(`check requirements of ${pfm}`);
    Log.info(`${pfm}: `);

    const module = await importPlatform(pfm);
    if (!module.modules.every((module) => isInstalled(packages, module))) {
      Log.error(`${Log.emoji.fail} Platform \`${pfm}\` is not installed. Please use \`uniapp platform add ${pfm}\`.`);
      continue;
    }
    await module.requirement({ packages });

    Log.info();
  }
}
