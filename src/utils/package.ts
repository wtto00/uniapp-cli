import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { readPackageJSON } from 'pkg-types'
import { App } from './app.js'

export function isInstalled(module: string): boolean {
  const packages = App.getPackageJson()
  return !!(
    packages.dependencies?.[module] ||
    packages.devDependencies?.[module] ||
    packages.optionalDependencies?.[module] ||
    packages.peerDependencies?.[module]
  )
}
export async function getModuleVersion(module: string) {
  if (!isInstalled(module)) return ''
  const modulePackage = resolve(App.projectRoot, `./node_modules/${module}/package.json`)
  if (!existsSync(modulePackage)) {
    throw Error(`请先执行命令 \`${App.getPackageManager().name} install\` 安装依赖！`)
  }
  try {
    const modulePackageJson = await readPackageJSON(modulePackage)
    return modulePackageJson.version ?? ''
  } catch (_error) {
    throw Error(`读取文件 ${modulePackage} 失败。`)
  }
}

export function checkIsUniapp() {
  if (!isInstalled('@dcloudio/uni-app')) {
    throw Error('当前目录不是一个uniapp应用。')
  }
}
