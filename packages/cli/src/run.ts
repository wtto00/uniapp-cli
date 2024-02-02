import { outputRemoveColor, spawnExec } from "./utils/exec";
import { checkIsUniapp, getPackage } from "./utils/package";
import { PLATFORM, allPlatforms, isModulesInstalled } from "./utils/platform";

export interface RunOptions {
  debug?: boolean;
  release?: boolean;
  device?: boolean;
  emulator?: boolean;
  list?: boolean;
  target?: string;
}

export async function run(platform: PLATFORM, options: RunOptions) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  if (!allPlatforms.includes(platform)) {
    console.error(`Unknown platform: ${platform}.`);
    return;
  }

  if (!isModulesInstalled(platform, packages)) {
    console.error(
      `Platform ${platform} has not been installed. Run \`uni platform add ${platform}\` to add this platform.`
    );
    return;
  }

  const module = (await import(`./platforms/${platform}`)).default as PlatformModule.ModuleClass;

  await module.brforeRun?.();

  let success = false;
  let over = false;
  let output: string[] = [];
  spawnExec(`npx uni -p ${platform}`, { stdio: "pipe", shell: true }, (msg) => {
    console.log(msg.substring(0, msg.length - 1));
    if (over) return;
    output.push(outputRemoveColor(msg));
    success ||= module.isRunSuccessed ? module.isRunSuccessed(platform, msg, output) : true;
    if (!success) return;
    module.afterRun?.(platform, msg, output);
    over = true;
  });
}
