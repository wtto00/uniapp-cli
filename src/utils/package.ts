import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { PackageJson } from 'types-package-json'

export async function readPackageJSON (packagePath: string): Promise<Partial<PackageJson>> {
  const packageStr = readFileSync(packagePath, { encoding: 'utf8' })
  return JSON.parse(packageStr)
}

export async function getPackage (): Promise<Partial<PackageJson>> {
  const currentPath = resolve('./')
  const packagePath = resolve(currentPath, './package.json')
  const packageJson = await readPackageJSON(packagePath)
  if (!isInstalled(packageJson, '@dcloudio/uni-app')) {
    throw Error('Current working directory is not a Uniapp-based project.')
  }
  return packageJson
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

export function detectPackageManager (): 'pnpm' | 'yarn' | 'npm' {
  if (existsSync(resolve('./pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(resolve('./yarn.lock'))) return 'yarn'
  return 'npm'
}
