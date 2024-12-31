import { cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { PackageJson } from 'pkg-types'
import { App } from '../utils/app.js'
import { editJsonFile, readJsonFile } from '../utils/file.js'
import Log from '../utils/log.js'
import { HarmonyDir } from '../utils/path.js'
import type { BuildProfile } from './templates/build-profile.js'

export const assetsAppsPath = join(HarmonyDir, 'entry/src/main/resources/resfile/apps/HBuilder/www')

export const devDistPath = join(App.projectRoot, 'dist/dev/app-harmony')

export const buildDistPath = join(App.projectRoot, 'dist/build/app-harmony')

export async function copyWww(options?: { isBuild?: boolean }) {
  const buildDistDir = options?.isBuild ? buildDistPath : devDistPath
  const files = await readdir(buildDistDir)
  for (const file of files) {
    const filePath = join(buildDistDir, file)
    if (file === 'uni_modules') {
      const hmFiles = await readdir(filePath)
      for (const hmFile of hmFiles) {
        const hmFilePath = join(filePath, hmFile)
        if (hmFile === 'build-profile.json5') {
          const modules = readJsonFile<BuildProfile>(hmFilePath, true).modules || []
          if (modules.length > 0) {
            await editJsonFile(join(HarmonyDir, hmFile), (data: BuildProfile) => {
              data.modules.push(...modules)
            })
          }
        } else if (hmFile === 'index.generated.ets') {
          await cp(hmFilePath, join(HarmonyDir, `entry/src/main/ets/uni_modules/${hmFile}`), { recursive: true })
        } else if (hmFile === 'oh-package.json5') {
          const dependencies = readJsonFile<PackageJson>(hmFilePath, true) || {}
          if (Object.keys(dependencies).length > 0) {
            await editJsonFile(join(HarmonyDir, hmFile), (data: PackageJson) => {
              if (!data.dependencies) data.dependencies = dependencies
              else {
                for (const key in dependencies) {
                  if (data.dependencies[key]) {
                    if (data.dependencies[key] === dependencies[key]) continue
                    Log.debug(`uni_modules 依赖 \`${key}\` 版本不一致，使用版本 ${dependencies[key]}`)
                  }
                  data.dependencies[key] = dependencies[key]
                }
              }
            })
          }
        }
      }
    } else {
      await cp(filePath, join(assetsAppsPath, file), { recursive: true })
    }
  }
}
