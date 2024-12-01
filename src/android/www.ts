import { cpSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { App } from '../utils/app.js'
import { AndroidDir } from '../utils/path.js'

export const assetsAppsPath = resolve(AndroidDir, 'app/src/main/assets/apps')

export function getWwwPath() {
  const manifest = App.getManifestJson()
  return resolve(assetsAppsPath, `${manifest.appid}/www`)
}

export const devDistPath = resolve(App.projectRoot, 'dist/dev/app')

export const buildDistPath = resolve(App.projectRoot, 'dist/build/app')

export function copyWww(isBuild?: boolean) {
  const wwwPath = getWwwPath()
  const uts: Record<string, string> = {}
  const buildDistDir = resolve(App.projectRoot, isBuild ? buildDistPath : devDistPath)
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
