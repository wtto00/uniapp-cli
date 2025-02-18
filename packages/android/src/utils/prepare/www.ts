import { cpSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { AndroidDir, App } from '@wtto00/uniapp-common'

export const assetsAppsPath = join(AndroidDir, 'app/src/main/assets/apps')

export async function getWwwPath() {
  const manifest = await App.getManifestJson()
  return join(assetsAppsPath, `${manifest.appid}/www`)
}

export const devDistPath = join(App.projectRoot, 'dist/dev/app')

export const buildDistPath = join(App.projectRoot, 'dist/build/app')

export const hBuilderDistPath = join(App.projectRoot, 'dist/build/app-plus')

export async function copyWww(options?: { isBuild?: boolean; isHBuilderX?: boolean }) {
  const wwwPath = await getWwwPath()
  const uts: Record<string, string> = {}
  const buildDistDir = options?.isHBuilderX ? hBuilderDistPath : options?.isBuild ? buildDistPath : devDistPath
  const files = readdirSync(buildDistDir)
  for (const file of files) {
    if (file === 'uni_modules') {
      const modules = readdirSync(join(buildDistDir, file))
      for (const moduleName of modules) {
        const moduleFiles = readdirSync(join(buildDistDir, file, moduleName))
        for (const moduleFile of moduleFiles) {
          if (moduleFile === 'utssdk') {
            uts[moduleName] = join(buildDistDir, file, moduleName, 'utssdk')
          } else {
            cpSync(join(buildDistDir, file, moduleName, moduleFile), join(wwwPath, file, moduleName, moduleFile), {
              recursive: true,
            })
          }
        }
      }
    } else {
      cpSync(join(buildDistDir, file), join(wwwPath, file), { recursive: true })
    }
  }
  return uts
}
