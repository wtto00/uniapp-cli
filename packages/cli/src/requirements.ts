import { checkIsUniapp, getPackage } from "./utils/package";
import { PLATFORM, allPlatforms, isDevToolsInstalled, isModulesInstalled, isVue3Supported } from "./utils/platform";

export async function requirements(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const validPlatforms: PLATFORM[] = platforms.reduce<PLATFORM[]>((prev, pfm) => {
    if (allPlatforms.includes(pfm)) prev.push(pfm);
    return prev;
  }, []);

  for (const pfm of validPlatforms) {
    console.debug(`check requirements of ${pfm}`);
    console.info(`${pfm}: `);

    const vue3Support = await isVue3Supported(pfm, packages);
    if (!vue3Support) {
      console.warn(`Vue3 currently does not support ${pfm}\n`);
    }

    if (!isDevToolsInstalled(pfm)) {
      console.warn("Dev tools is not installed.");
    } else {
      console.success("Dev tools is installed.");
    }
    console.info();
  }
}
