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

export function spawnExecSync(
  cmd: string,
  args: string[] = [],
  option?: Omit<SpawnSyncOptionsWithStringEncoding, "encoding">,
) {
  return spawnSync(`"${cmd}"`, args, { encoding: "utf8", shell: true, ...option });
}

export function spawnExec(
  cmd: string,
  args: string[],
  callback: (log: string) => void,
  option?: Omit<SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>, "stdio">,
) {
  const proc = spawn(`"${cmd}"`, args, { stdio: ["inherit", "pipe", "pipe"], shell: true, ...option });

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
  // oxlint-disable no-control-regex
  return text.replace(/\x1B\[\d+m/g, "");
}

/**
 * `@vue/cli` has been installed or not
 */
export function isVueCliInstalled() {
  return getOutput(spawnExecSync("vue")).includes("Usage: vue");
}

export function installVueCli() {
  Log.info("@vue/cli not installed, starting global installation of @vue/cli.");
  spawnExecSync("npm", ["i", "-g", "@vue/cli"], { stdio: "inherit" });
  if (isVueCliInstalled()) {
    Log.info("@vue/cli has been successfully installed.");
  } else {
    Log.warn("@vue/cli installation failed. Please manually execute npm i -g @vue/cli.");
    process.exit();
  }
}

export function createVueProject(appName: string, template: string, force = false) {
  spawnExecSync("vue", ["create", "-p", template, appName, force ? "--force" : ""], { stdio: "inherit" });
}

export function installPackages(packages: string[]) {
  const pm = detectPackageManager();
  spawnExecSync(pm, [pm === "npm" ? "install" : "add", ...packages], { stdio: "inherit" });
}

export function uninstallPackages(packages: string[]) {
  const pm = detectPackageManager();
  spawnExecSync(pm, [pm === "npm" ? "uninstall" : "remove", ...packages], { stdio: "inherit" });
}
