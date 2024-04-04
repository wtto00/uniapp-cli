import {
  type SpawnSyncOptionsWithStringEncoding,
  spawnSync,
  spawn,
  type SpawnOptionsWithoutStdio,
} from "node:child_process";
import { detectPackageManager } from "./package.js";
import { Log } from "./log.js";

export function spwanSyncExec(command: string, option?: Omit<SpawnSyncOptionsWithStringEncoding, "encoding">) {
  const [cmd, ...args] = command
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item);
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: true, ...option });
  return res.output.reverse().reduce((prev, curr) => prev + (curr ?? ""), "") ?? "";
}

export function spawnExecSync(command: string, option?: Omit<SpawnSyncOptionsWithStringEncoding, "encoding">) {
  const [cmd, ...args] = command
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item);
  return spawnSync(cmd, args, { encoding: "utf8", shell: true, ...option });
}

export function spawnExec(command: string, option?: SpawnOptionsWithoutStdio, callback?: (log: string) => void) {
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
 * Remove the color of the output text
 * @param text output text
 */
export function outputRemoveColor(text: string) {
  return text.replace(/\x1B\[\d+m/g, "");
}

/**
 * @vue/cli has been installed or not
 */
export function isVueCliInstalled() {
  return spwanSyncExec("vue").includes("Usage: vue");
}

export function installVueCli() {
  Log.info("@vue/cli not installed, starting global installation of @vue/cli.");
  spwanSyncExec("npm i -g @vue/cli", { stdio: "inherit" });
  if (isVueCliInstalled()) {
    Log.info("@vue/cli has been successfully installed.");
  } else {
    Log.warn("@vue/cli installation failed. Please manually execute npm i -g @vue/cli.");
    process.exit();
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
