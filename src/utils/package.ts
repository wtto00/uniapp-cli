import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { type PackageJson, readPackageJSON } from 'pkg-types'
import { Log } from './log.js'

export async function getPackageJson() {
  try {
    return await readPackageJSON(global.projectRoot)
  } catch (error) {
    Log.warn((error as Error).message)
    process.exit()
  }
}
export function isInstalled(packages: PackageJson, module: string) {
  const allDependencies = {
    ...packages.dependencies,
    ...packages.devDependencies,
    ...packages.optionalDependencies,
    ...packages.peerDependencies,
  }
  return !!allDependencies[module]
}
export async function getModuleVersion(packages: PackageJson, module: string) {
  if (!isInstalled(packages, module)) return ''
  const modulePackage = resolve(global.projectRoot, `./node_modules/${module}/package.json`)
  if (!existsSync(modulePackage)) {
    Log.warn('请先执行命令 npm install/pnpm install/yarn install 安装依赖！')
    return ''
  }
  try {
    const modulePackageJson = await readPackageJSON(modulePackage)
    return modulePackageJson.version ?? ''
  } catch (_error) {
    Log.error(`读取文件 ${modulePackage} 失败。`)
    return ''
  }
}

export function checkIsUniapp(packages: PackageJson) {
  if (!isInstalled(packages, '@dcloudio/uni-app')) {
    Log.warn('当前目录不是一个uniapp项目。')
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
