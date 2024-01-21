import { installPackages } from "./utils/exec";
import { checkIsUniapp, getModuleVersion, getPackage } from "./utils/package";
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

  for (let i = 0; i < platforms.length; i++) {
    const pfm = platforms[i];
    if (!ALL_PLATFORMS[pfm]) {
      console.error(`${pfm} is not an valid platform value.\n`);
    } else {
      const modules = ALL_PLATFORMS[pfm].modules || [];
    }
  }
}

/**
 * list platforms
 */
export function list() {}
