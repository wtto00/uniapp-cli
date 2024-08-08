import { allPlatforms, importPlatform, type PLATFORM } from "./platforms/index.js";
import { type BuildOptions, checkIsUniapp, getPackageJson, isInstalled, Log } from "@uniapp-cli/common";

export async function build(platform: PLATFORM, options: BuildOptions) {
  const packages = await getPackageJson();
  checkIsUniapp(packages);

  if (!allPlatforms.includes(platform)) {
    Log.error(`Unknown platform: ${platform}.`);
    return;
  }

  const module = await importPlatform(platform);

  if (module.modules.some((module) => !isInstalled(packages, module))) {
    Log.error(
      `Platform ${platform} has not been installed. Run \`uni platform add ${platform}\` to add this platform.`
    );
    return;
  }

  await module.build(options);
}
