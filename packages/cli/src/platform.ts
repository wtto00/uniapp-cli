import { installPackages, uninstallPackages } from "./utils/exec";
import { checkIsUniapp, getModuleVersion, getPackage, isInstalled } from "./utils/package";
import { PLATFORM, allPlatforms, isModulesInstalled } from "./utils/platform";

/**
 * add platforms
 */
export async function add(platforms: PLATFORM[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const uniVersoin = await getModuleVersion(packages, "@dcloudio/uni-app");

  if (!uniVersoin) {
    console.error("Cannot get version of uniapp.");
    process.exit(-3);
  }

  for (const pfm of platforms) {
    if (!allPlatforms.includes(pfm)) {
      console.error(`${pfm} is not an valid platform value.\n`);
      continue;
    }

    const module = (await import(`./platforms/${pfm}`)).default as PlatformModule.ModuleClass;

    await module.beforePlatformAdd?.(packages);

    const modules = module.getModules();
    installPackages(modules.map((m) => `${m}@^${uniVersoin}`));

    await module.afterPlatformAdd?.(packages);
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
    const module = (await import(`./platforms/${pfm}`)).default as PlatformModule.ModuleClass;
    await module.beforePlatformRemove?.();
    const modules = module.getModules().filter((module) => isInstalled(packages, module));
    uninstallPackages(modules);
    await module.afterPlatformRemove?.();
  }
}

/**
 * list platforms
 */
export async function list() {
  const packages = await getPackage();
  checkIsUniapp(packages);

  for (const pfm of allPlatforms) {
    const module = (await import(`./platforms/${pfm}`)).default as PlatformModule.ModuleClass;
    if (isModulesInstalled(module, packages)) {
      console.success(`${pfm}: Installed`);
    } else {
      console.warn(`${pfm}: Not installed`);
    }
  }
}
