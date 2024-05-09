import { importPlatform } from "./platforms/index.js";
import { checkIsUniapp, getPackageJson, isInstalled, Log } from "@uniapp-cli/common";
import { type RunOptions, type PLATFORM, allPlatforms } from "./platforms/index.js";

export async function run(platform: PLATFORM, options: RunOptions) {
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

  await module.run(options);
}
