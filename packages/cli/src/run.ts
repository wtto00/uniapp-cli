import { importPlatform } from "./platforms";
import { checkIsUniapp, getPackage, isInstalled } from "./utils/package";
import { PLATFORM, allPlatforms } from "./utils/platform";

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
