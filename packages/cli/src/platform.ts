import { installPackages, uninstallPackages } from "./utils/exec";
import { checkIsUniapp, getModuleVersion, getPackage, isInstalled } from "./utils/package";
import { ALL_PLATFORMS, PLATFORMS } from "./utils/platform";

/**
 * add platforms
 */
export async function add(platforms: PLATFORMS[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const uniVersoin = await getModuleVersion(packages, "@dcloudio/uni-app");

  for (let i = 0; i < platforms.length; i++) {
    const pfm = platforms[i];
    if (!ALL_PLATFORMS[pfm]) {
      console.error(`${pfm} is not an valid platform value.\n`);
    } else {
      const { vue3NotSupport, modules } = ALL_PLATFORMS[pfm];
      if (vue3NotSupport) {
        const vueVersion = await getModuleVersion(packages, "vue");
        if (vueVersion >= "3") {
          console.error(`Vue3 currently does not support ${pfm}\n`);
        }
      } else {
        if (!uniVersoin) {
          console.error("Cannot get version of uniapp.");
        } else {
          installPackages(modules.map((m) => `${m}@^${uniVersoin}`));
        }
      }
    }
  }
}

/**
 * remove platforms
 */
export async function remove(platforms: PLATFORMS[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  for (const pfm of platforms) {
    console.debug(`remove platform: ${pfm}`);
    if (!ALL_PLATFORMS[pfm]) {
      console.error(`${pfm} is not an valid platform value.\n`);
    } else {
      const modules = (ALL_PLATFORMS[pfm].modules || []).filter((module) => isInstalled(packages, module));
      uninstallPackages(modules);
    }
  }
}

/**
 * list platforms
 */
export async function list() {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const vueVersion = await getModuleVersion(packages, "vue");

  for (const pfm in ALL_PLATFORMS) {
    const platform = ALL_PLATFORMS[pfm as PLATFORMS];
    if (platform.modules.every((module) => isInstalled(packages, module))) {
      if (platform.vue3NotSupport && vueVersion >= "3") {
        console.info(`${pfm}: Vue3 not support`);
      } else {
        console.info(`${pfm}: Installed`);
      }
    } else {
      console.info(`${pfm}: Not installed`);
    }
  }
}
