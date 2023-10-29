import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import Log from './log'
import type { PackageJson } from 'types-package-json'

export async function readPackageJSON (packagePath: string): Promise<Partial<PackageJson>> {
  if (!existsSync(packagePath)) {
    Log.error("Current working directory does't have a package.json file.")
    process.exit(-1)
  }
  return await import(packagePath)
}

export async function getPackage (): Promise<Partial<PackageJson>> {
  const currentPath = resolve('./')
  const packagePath = resolve(currentPath, './package.json')
  return await readPackageJSON(packagePath)
}
export function isInstalled (packages: Partial<PackageJson>, module: string): boolean {
  const allDependencies = {
    ...packages.dependencies,
    ...packages.devDependencies,
    ...packages.optionalDependencies,
    ...packages.peerDependencies
  }
  return !!allDependencies[module]
}
export async function getModuleVersion (packages: Partial<PackageJson>, module: string): Promise<string> {
  if (!isInstalled(packages, module)) return ''
  const modulePackage = resolve(`./node_modules/${module}/package.json`)
  const modulePackageJson = await readPackageJSON(modulePackage)
  return modulePackageJson.version ?? ''
}

export function checkIsUniapp (packages: Partial<PackageJson>): void {
  if (!isInstalled(packages, '@dcloudio/uni-app')) {
    Log.error('Current working directory is not a Uniapp-based project.')
    process.exit(-2)
  }
}

export function detectPackageManager (): 'pnpm' | 'yarn' | 'npm' {
  if (existsSync(resolve('./pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(resolve('./yarn.lock'))) return 'yarn'
  return 'npm'
}
