import { importPlatform, type PLATFORM, allPlatforms } from "./platforms/index.js";
import { checkIsUniapp, getPackageJson, isInstalled } from "@uniapp-cli/common";

export async function requirements(platforms: PLATFORM[]) {
  const packages = await getPackageJson();
  checkIsUniapp(packages);

  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, pfm) => {
    if (allPlatforms.includes(pfm)) prev.push(pfm);
    return prev;
  }, []);

  for (const pfm of validPlatforms) {
    process.Log.debug(`check requirements of ${pfm}`);
    process.Log.info(`${pfm}: `);

    const module = await importPlatform(pfm);
    if (!module.modules.every((module) => isInstalled(packages, module))) {
      process.Log.error(
        `${process.Log.emoji.fail} Platform \`${pfm}\` is not installed. Please use \`uniapp platform add ${pfm}\`.`
      );
      continue;
    }
    await module.requirement({ packages });

    process.Log.info();
  }
}
