import {
  type SpawnSyncOptionsWithStringEncoding,
  spawnSync,
  spawn,
  type SpawnOptionsWithStdioTuple,
  type StdioPipe,
  type StdioNull,
  type SpawnSyncReturns,
  type ChildProcess,
} from "node:child_process";
import { detectPackageManager } from "./package.js";
import { Log } from "./log.js";

export function spawnExecSync(command: string, option?: Omit<SpawnSyncOptionsWithStringEncoding, "encoding">) {
  const [cmd, ...args] = command
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item);
  return spawnSync(cmd, args, { encoding: "utf8", shell: true, ...option });
}

export function spawnExec(
  command: string,
  callback: (log: string) => void,
  option?: Omit<SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>, "stdio">
) {
  const [cmd, ...args] = command
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item);
  const proc = spawn(cmd, args, { stdio: ["inherit", "pipe", "pipe"], shell: true, ...option });

  proc.stdout.pipe(process.stdout);
  proc.stdout.setEncoding("utf8");
  proc.stdout.on("data", callback);
  proc.stderr.pipe(process.stdout);
  proc.stderr.setEncoding("utf8");
  proc.stderr.on("data", Log.error);

  return proc;
}

export function killChildProcess(proc: ChildProcess) {
  proc.stdout?.destroy();
  proc.stderr?.destroy();
  proc.kill("SIGKILL");
}

/**
 * Get output string from spawnSync
 * @param proc child_process
 * @returns
 */
export function getOutput(proc: SpawnSyncReturns<string>) {
  return proc.output.reverse().reduce((prev, curr) => prev + (curr ?? ""), "") ?? "";
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
  return getOutput(spawnExecSync("vue")).includes("Usage: vue");
}

export function installVueCli() {
  Log.info("@vue/cli not installed, starting global installation of @vue/cli.");
  spawnExecSync("npm i -g @vue/cli", { stdio: "inherit" });
  if (isVueCliInstalled()) {
    Log.info("@vue/cli has been successfully installed.");
  } else {
    Log.warn("@vue/cli installation failed. Please manually execute npm i -g @vue/cli.");
    process.exit();
  }
}

export function createVueProject(appName: string, template: string, force = false) {
  const cmd = `vue create -p ${template} ${appName} ${force ? "--force" : ""}`;
  spawnExecSync(cmd, { stdio: "inherit" });
}

export function installPackages(packages: string[]) {
  const pm = detectPackageManager();
  const pmCmd = pm === "npm" ? `${pm} install` : `${pm} add`;
  const cmd = `${pmCmd} ${packages.join(" ")}`;
  spawnExecSync(cmd, { stdio: "inherit" });
}

export function uninstallPackages(packages: string[]) {
  const pm = detectPackageManager();
  const pmCmd = pm === "npm" ? `${pm} uninstall` : `${pm} remove`;
  const cmd = `${pmCmd} ${packages.join(" ")}`;
  spawnExecSync(cmd, { stdio: "inherit" });
}
