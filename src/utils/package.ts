import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { detect } from 'package-manager-detector'
import { type PackageJson, readPackageJSON } from 'pkg-types'
import { Log } from './log.js'
import { projectRoot } from './path.js'

export const Package = {
  packages: {} as PackageJson,

  init() {
    Package.packages = readPackageJSONSync(projectRoot)
  },
}

export function isInstalled(packages: PackageJson, module: string): boolean {
  return !!(
    packages.dependencies?.[module] ||
    packages.devDependencies?.[module] ||
    packages.optionalDependencies?.[module] ||
    packages.peerDependencies?.[module]
  )
}
export async function getModuleVersion(packages: PackageJson, module: string) {
  if (!isInstalled(packages, module)) return ''
  const modulePackage = resolve(projectRoot, `./node_modules/${module}/package.json`)
  if (!existsSync(modulePackage)) {
    const pm = await detect()
    if (!pm) throw Error('没有检测到包管理器。')
    throw Error(`请先执行命令 \`${pm} install\` 安装依赖！`)
  }
  try {
    const modulePackageJson = await readPackageJSON(modulePackage)
    return modulePackageJson.version ?? ''
  } catch (_error) {
    throw Error(`读取文件 ${modulePackage} 失败。`)
  }
}

export function checkIsUniapp(packages: PackageJson) {
  if (!isInstalled(packages, '@dcloudio/uni-app')) {
    Log.error('当前目录不是一个uniapp应用。')
    process.exit()
  }
}

export function readPackageJSONSync(filePath: string): PackageJson {
  try {
    const packagePath = filePath.endsWith('/package.json') ? filePath : resolve(filePath, 'package.json')
    const content = readFileSync(packagePath, { encoding: 'utf8' })
    return JSON.parse(content) as PackageJson
  } catch (_error) {
    return {}
  }
}
