import {
  type SpawnSyncOptionsWithStringEncoding,
  spawnSync,
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptions,
  SpawnOptionsWithoutStdio,
} from "node:child_process";
import { detectPackageManager } from "./package";

export function spwanSyncExec(command: string, option?: Omit<SpawnSyncOptionsWithStringEncoding, "encoding">) {
  console.debug(command);
  const [cmd, ...args] = command
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item);
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: true, ...option });
  return res.output.reverse().reduce((prev, curr) => prev + (curr ?? ""), "") ?? "";
}

export function spawnExec(command: string, option?: SpawnOptionsWithoutStdio, callback?: (log: string) => void) {
  console.debug(command);
  const [cmd, ...args] = command
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item);
  const proc = spawn(cmd, args, option);
  if (callback) {
    proc.stdout.setEncoding("utf8");
    proc.stdout.on("data", (data) => {
      callback(data);
    });
  }

  return proc;
}

/**
 * @vue/cli has been installed or not
 */
export function isVueCliInstalled() {
  return spwanSyncExec("vue").includes("Usage: vue");
}

export function installVueCli() {
  console.info("@vue/cli not installed, starting global installation of @vue/cli.");
  spwanSyncExec("npm i -g @vue/cli", { stdio: "inherit" });
  if (isVueCliInstalled()) {
    console.debug("@vue/cli has been successfully installed.");
  } else {
    console.error("@vue/cli installation failed. Please manually execute npm i -g @vue/cli.");
    process.exit(-1);
  }
}

export function createVueProject(appName: string, template: string, force = false) {
  const cmd = `vue create -p ${template} ${appName} ${force ? "--force" : ""}`;
  spwanSyncExec(cmd, { stdio: "inherit" });
}

export function installPackages(packages: string[]) {
  const pm = detectPackageManager();
  const pmCmd = pm === "npm" ? `${pm} install` : `${pm} add`;
  const cmd = `${pmCmd} ${packages.join(" ")}`;
  spwanSyncExec(cmd, { stdio: "inherit" });
}

export function uninstallPackages(packages: string[]) {
  const pm = detectPackageManager();
  const pmCmd = pm === "npm" ? `${pm} uninstall` : `${pm} remove`;
  const cmd = `${pmCmd} ${packages.join(" ")}`;
  spwanSyncExec(cmd, { stdio: "inherit" });
}
