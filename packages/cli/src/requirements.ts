import { checkIsUniapp, getModuleVersion, getPackage, isInstalled } from "./utils/package";
import { ALL_PLATFORMS, PLATFORMS } from "./utils/platform";

export async function requirements(platforms: PLATFORMS[]) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const allPlatforms = Object.keys(ALL_PLATFORMS) as PLATFORMS[];
  const checkCurrentDirectory = !Array.isArray(platforms) || platforms.length === 0;

  const platform: PLATFORMS[] = checkCurrentDirectory
    ? allPlatforms.filter((pfm) =>
        (ALL_PLATFORMS[pfm as PLATFORMS].modules || []).every((module) => isInstalled(packages, module))
      )
    : platforms.reduce<PLATFORMS[]>((sum, pfm) => {
        if (ALL_PLATFORMS[pfm]) sum.push(pfm);
        return sum;
      }, []);

  for (let i = 0; i < platform.length; i++) {
    const pfm = platform[i];
    console.debug(`check requirements of ${pfm}`);
    console.info(`${pfm}: `);

    const { vue3NotSupport, envs } = ALL_PLATFORMS[pfm];

    // check vue3 support
    if (vue3NotSupport) {
      const vueVersion = await getModuleVersion(packages, "vue");
      if (vueVersion >= "3") {
        console.error(`Vue3 currently does not support ${pfm}\n`);
        return;
      }
    }

    // check environments of requirement
    (envs ?? []).forEach((/** @type {string} */ env) => {
      if (process.env[env]) {
        console.info(`env: ${env} already set`);
      } else {
        console.info(`env: ${env} not set yet`);
      }
    });
    console.info();
  }
}
