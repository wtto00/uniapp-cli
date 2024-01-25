import { spawnExec, spwanSyncExec } from "./utils/exec";
import { checkIsUniapp, getPackage } from "./utils/package";
import { ALL_PLATFORMS, PLATFORMS } from "./utils/platform";

export interface RunOptions {
  debug?: boolean;
  release?: boolean;
  device?: boolean;
  emulator?: boolean;
  list?: boolean;
  target?: string;
}

export async function run(platform: PLATFORMS, options: RunOptions) {
  const packages = await getPackage();
  checkIsUniapp(packages);

  const pfm = ALL_PLATFORMS[platform];
  if (!pfm) {
    console.error(`Unknown platform: ${platform}.`);
    return;
  }

  let success = false;
  let output: string[] = [];
  spawnExec(`npx uni -p ${platform}`, { stdio: "pipe", shell: true }, (msg) => {
    console.log(msg.substring(0, msg.length - 1));
    if (!pfm.runSuccess || !pfm.opener || success) return;
    output.push(msg.replace(/\x1B\[\d+m/g, ""));
    if (pfm.runSuccess(msg, output)) {
      success = true;
      const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
      const line = output.find((l) => regex.test(l));
      if (line) {
        const url = line.match(regex)?.[1];
        url && pfm.opener(url);
      }
    }
  });
}
