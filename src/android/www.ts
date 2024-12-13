import { cpSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { App } from '../utils/app.js'
import { AndroidDir } from '../utils/path.js'

export const assetsAppsPath = join(AndroidDir, 'app/src/main/assets/apps')

export function getWwwPath() {
  const manifest = App.getManifestJson()
  return join(assetsAppsPath, `${manifest.appid}/www`)
}

export const devDistPath = join(App.projectRoot, 'dist/dev/app')

export const buildDistPath = join(App.projectRoot, 'dist/build/app')

export const hBuilderDistPath = join(App.projectRoot, 'dist/build/app-plus')

export function copyWww(options?: { isBuild?: boolean; isHBuilderX?: boolean }) {
  const wwwPath = getWwwPath()
  const uts: Record<string, string> = {}
  const buildDistDir = resolve(
    App.projectRoot,
    options?.isHBuilderX ? hBuilderDistPath : options?.isBuild ? buildDistPath : devDistPath,
  )
  const files = readdirSync(buildDistDir)
  for (const file of files) {
    if (file === 'uni_modules') {
      const modules = readdirSync(resolve(buildDistDir, file))
      for (const moduleName of modules) {
        const moduleFiles = readdirSync(resolve(buildDistDir, file, moduleName))
        for (const moduleFile of moduleFiles) {
          if (moduleFile === 'utssdk') {
            uts[moduleName] = resolve(buildDistDir, file, moduleName, 'utssdk')
          } else {
            cpSync(
              resolve(buildDistDir, file, moduleName, moduleFile),
              resolve(wwwPath, file, moduleName, moduleFile),
              { recursive: true },
            )
          }
        }
      }
    } else {
      cpSync(resolve(buildDistDir, file), resolve(wwwPath, file), { recursive: true })
    }
  }
  return uts
}
