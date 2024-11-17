import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { PackageJson } from 'pkg-types'
import { App } from './app.js'
import { readJsonFile } from './file.js'

export function isInstalled(module: string): boolean {
  const packages = App.getPackageJson()
  return !!getPackageDependencies(packages)[module]
}
export function getModuleVersion(module: string) {
  if (!isInstalled(module)) return ''
  const modulePackage = resolve(App.projectRoot, `node_modules/${module}/package.json`)
  if (!existsSync(modulePackage)) {
    throw Error(`请先执行命令 \`${App.getPackageManager().name} install\` 安装依赖！`)
  }
  return readJsonFile<PackageJson>(modulePackage).version ?? ''
}

export function checkIsUniapp() {
  if (!isInstalled('@dcloudio/uni-app')) {
    throw Error('当前目录不是一个uniapp应用。')
  }
}

export function getPackageDependencies(packageJson: PackageJson) {
  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.optionalDependencies,
    ...packageJson.peerDependencies,
  }
}
