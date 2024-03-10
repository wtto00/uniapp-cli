import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { type PackageJson, readPackageJSON } from "pkg-types";
import { projectRoot } from "./path.js";
import { Log } from "./log.js";

export async function getPackageJson() {
  try {
    return await readPackageJSON(projectRoot);
  } catch (error) {
    Log.warn((error as Error).message);
    process.exit();
  }
}
export function isInstalled(packages: PackageJson, module: string) {
  const allDependencies = {
    ...packages.dependencies,
    ...packages.devDependencies,
    ...packages.optionalDependencies,
    ...packages.peerDependencies,
  };
  return !!allDependencies[module];
}
export async function getModuleVersion(packages: PackageJson, module: string) {
  if (!isInstalled(packages, module)) return "";
  const modulePackage = resolve(projectRoot, `./node_modules/${module}/package.json`);
  if (!existsSync(modulePackage)) {
    Log.warn("Please run `npm install` first!");
    return "";
  }
  try {
    const modulePackageJson = await readPackageJSON(modulePackage);
    return modulePackageJson.version ?? "";
  } catch (error) {
    Log.error(`Error loading  ${modulePackage}.`);
    return "";
  }
}

export function checkIsUniapp(packages: PackageJson) {
  if (!isInstalled(packages, "@dcloudio/uni-app")) {
    Log.warn("Current working directory is not a Uniapp-based project.");
    process.exit();
  }
}

export function detectPackageManager() {
  if (existsSync(resolve(projectRoot, "./pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(resolve(projectRoot, "./yarn.lock"))) return "yarn";
  return "npm";
}
