import { installPackages, uninstallPackages } from "./utils/exec";
import { checkIsUniapp, getModuleVersion, getPackage, isInstalled } from "./utils/package";
import { PLATFORM, allPlatforms, getModules, isVue3Supported, notSupportVue3 } from "./utils/platform";

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const uniVersoin = await getModuleVersion(packages, "@dcloudio/uni-app");

  for (const pfm of platforms) {
    if (!allPlatforms.includes(pfm)) {
      console.error(`${pfm} is not an valid platform value.\n`);
      continue;
    }

    if (notSupportVue3(pfm)) {
      const vue3Support = isVue3Supported(pfm, packages);
      if (!vue3Support) {
        console.error(`Vue3 currently does not support ${pfm}\n`);
        continue;
      }
    }

    if (!uniVersoin) {
      console.error("Cannot get version of uniapp.");
      continue;
    }

    const modules = getModules(pfm);
    installPackages(modules.map((m) => `${m}@^${uniVersoin}`));
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  for (const pfm of platforms) {
    console.debug(`remove platform: ${pfm}`);
    if (!allPlatforms.includes(pfm)) {
      console.error(`${pfm} is not an valid platform value.\n`);
      continue;
    }
    const modules = getModules(pfm).filter((module) => isInstalled(packages, module));
    uninstallPackages(modules);
  }
}

/**
 * list platforms
 */
export async function list() {
  const packages = await getPackage();
  checkIsUniapp(packages);

  for (const pfm of allPlatforms) {
    const modules = getModules(pfm);
    if (modules.every((module) => isInstalled(packages, module))) {
      if (notSupportVue3(pfm) && !isVue3Supported(pfm, packages)) {
        console.warn(`${pfm}: Vue3 not support`);
      } else {
        console.success(`${pfm}: Installed`);
      }
    } else {
      console.warn(`${pfm}: Not installed`);
    }
  }
}
