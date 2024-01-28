import { outputRemoveColor, spawnExec } from "./utils/exec";
import { checkIsUniapp, getPackage } from "./utils/package";
import { PLATFORM, afterRunSuccess, allPlatforms, isRunSuccessed } from "./utils/platform";

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

  let success = false;
  let over = false;
  let output: string[] = [];
  spawnExec(`npx uni -p ${platform}`, { stdio: "pipe", shell: true }, (msg) => {
    console.log(msg.substring(0, msg.length - 1));
    if (over) return;
    output.push(outputRemoveColor(msg));
    success ||= isRunSuccessed(platform, msg, output);
    if (!success) return;
    if (afterRunSuccess(platform, msg, output)) {
      over = true;
    }
  });
}
