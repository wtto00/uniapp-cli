import { importPlatform } from "./platforms";
import { checkIsUniapp, getPackage } from "./utils/package";
import { PLATFORM, allPlatforms } from "./utils/platform";

export async function requirements(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, pfm) => {
    if (allPlatforms.includes(pfm)) prev.push(pfm);
    return prev;
  }, []);

  for (const pfm of validPlatforms) {
    process.Log.debug(`check requirements of ${pfm}`);
    console.info(`${pfm}: `);

    const module = await importPlatform(pfm);
    await module.requirement({ packages });

    console.info();
  }
}
