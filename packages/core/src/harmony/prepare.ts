import { cp, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import type { PackageJson } from 'pkg-types'
import { App } from '../utils/app.js'
import { editJsonFile, exists, readJsonFile } from '../utils/file.js'
import Log from '../utils/log.js'
import { getPackageDependencies } from '../utils/package.js'
import { HarmonyDir, TemplateDir } from '../utils/path.js'
import type { AppJson } from './templates/app.json5.js'
import type { BuildProfile } from './templates/build-profile.js'
import type { ColorConfig } from './templates/element.json.js'

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
          const dependencies = getPackageDependencies(readJsonFile<PackageJson>(hmFilePath, true) || {})
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

export async function prepare(options?: { isBuild?: boolean }) {
  Log.debug('前端打包资源嵌入 Harmony 资源中')
  if (await exists(assetsAppsPath)) {
    await rm(assetsAppsPath, { recursive: true, force: true })
  }

  await copyWww(options)

  const manifest = App.getManifestJson()
  const { bundleName, modules, icons, splashScreens } = manifest['app-harmony']?.distribute ?? {}

  const appJsonPath = join(HarmonyDir, 'AppScope/app.json5')
  await editJsonFile(appJsonPath, (data: AppJson) => {
    data.app.bundleName = bundleName!
    data.app.versionCode = manifest.versionCode!
    data.app.versionName = manifest.versionName!
  })

  const iconForeground = icons?.foreground || join(TemplateDir, 'harmony/AppScope/resources/base/media/foreground.png')
  await cp(iconForeground, join(HarmonyDir, 'AppScope/resources/base/media/foreground.png'))

  const iconBackground = icons?.background || join(TemplateDir, 'harmony/AppScope/resources/base/media/background.png')
  await cp(iconBackground, join(HarmonyDir, 'AppScope/resources/base/media/background.png'))

  await editJsonFile(join(HarmonyDir, 'AppScope/resources/base/element/color.json'), (data: ColorConfig) => {
    const backgroundColor = splashScreens?.startWindowBackground || '#FFFFFF'
    const index = data.color.findIndex((item) => item.name === 'start_window_background')
    if (index > -1) {
      data.color[index].value = backgroundColor
    } else {
      data.color.push({
        name: 'start_window_background',
        value: backgroundColor,
      })
    }
  })
  const startIconPath =
    splashScreens?.startWindowIcon ||
    icons?.foreground ||
    join(TemplateDir, 'harmony/AppScope/resources/base/media/startIcon.png')
  await cp(startIconPath, join(HarmonyDir, 'AppScope/resources/base/media/startIcon.png'))

  await editJsonFile(join(HarmonyDir, 'oh-package.json5'), (data: PackageJson) => {
    if (!data.dependencies) data.dependencies = {}
    if (modules?.['uni-facialRecognitionVerify']) {
      data.dependencies['@uni_modules/uni-facialrecognitionverify'] = '1.0.2'
    }
    if (modules?.['uni-oauth']?.huawei) {
      data.dependencies['@uni_modules/uni-oauth-huawei'] = '1.0.1'
    }
    if (modules?.['uni-payment']?.alipay) {
      data.dependencies['@uni_modules/uni-payment-alipay'] = '1.0.1'
    }
    if (modules?.['uni-push']) {
      data.dependencies['@uni_modules/uni-push'] = '1.0.1'
    }
  })

  const harmonyConfigPath = join(App.projectRoot, 'src/harmony-configs')
  if (await exists(harmonyConfigPath)) {
    await cp(harmonyConfigPath, HarmonyDir, { recursive: true })
  }
}
