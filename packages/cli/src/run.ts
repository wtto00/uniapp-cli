import { importPlatform } from "./platforms/index.js";
import { checkIsUniapp, getPackage, isInstalled } from "./utils/package.js";
import { PLATFORM, allPlatforms } from "./utils/platform.js";

export async function run(platform: PLATFORM, options: UniappCli.RunOptions) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  if (!allPlatforms.includes(platform)) {
    process.Log.error(`Unknown platform: ${platform}.`);
    return;
  }

  const module = await importPlatform(platform);

  if (module.modules.some((module) => !isInstalled(packages, module))) {
    process.Log.error(
      `Platform ${platform} has not been installed. Run \`uni platform add ${platform}\` to add this platform.`
    );
    return;
  }

  await module.run(options);
}
