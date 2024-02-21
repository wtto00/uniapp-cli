import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { type PackageJson, readPackageJSON } from "pkg-types";

export async function getPackage() {
  const currentPath = process.env.PWD as string;
  const packagePath = resolve(currentPath, "./package.json");
  if (!existsSync(packagePath)) {
    process.Log.error("Current working directory does't have a package.json file.");
    process.exit();
  }
  return await readPackageJSON(packagePath);
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
  const modulePackage = resolve(`./node_modules/${module}/package.json`);
  if (!existsSync(modulePackage)) {
    process.Log.warn("Please run `npm install` first!");
    return "";
  }
  try {
    const modulePackageJson = await readPackageJSON(modulePackage);
    return modulePackageJson.version ?? "";
  } catch (error) {
    process.Log.debug(`Error loading  ${modulePackage}.`);
    return "";
  }
}

export function checkIsUniapp(packages: PackageJson) {
  if (!isInstalled(packages, "@dcloudio/uni-app")) {
    process.Log.error("Current working directory is not a Uniapp-based project.");
    process.exit();
  }
}

export function detectPackageManager() {
  if (existsSync(resolve("./pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(resolve("./yarn.lock"))) return "yarn";
  return "npm";
}
