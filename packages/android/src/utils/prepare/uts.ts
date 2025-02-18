import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { type AndroidAbiFilters, AndroidDir, readJsonFile } from '@wtto00/uniapp-common'
import { appendDependencies, appendPlugin } from './files/app-build.gradle.js'
import type { Results } from './results.js'
import { appendSet } from './xml.js'

export async function appendUTS(results: Results, uts: Record<string, string>) {
  if (Object.keys(uts).length === 0) return

  results.libs.add('utsplugin-release.aar')
  appendDependencies(results.appBuildGradle, {
    'com.squareup.okhttp3:okhttp:3.12.12': {},
    'androidx.core:core-ktx:1.6.0': {},
    'org.jetbrains.kotlin:kotlin-stdlib:1.8.10': {},
    'org.jetbrains.kotlin:kotlin-reflect:1.6.0': {},
    'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.8': {},
    'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.8': {},
    'com.github.getActivity:XXPermissions:18.0': {},
  })

  results.buildGradle.dependencies.add('org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.0')

  for (const name in uts) {
    appendDependencies(results.appBuildGradle, {
      [`:${name}`]: { project: true },
    })
    results.settingsGradle.add(name)
    const utsDir = resolve(uts[name], 'app-android')

    // config.json
    const configJson = resolve(utsDir, 'config.json')
    if (existsSync(configJson)) {
      const config = await readJsonFile<ConfigJson>(configJson)
      for (const item of config.dependencies ?? []) {
        if (typeof item === 'string') {
          appendDependencies(results.appBuildGradle, { [item]: {} })
        } else if (typeof item === 'object' && item.source) {
          appendDependencies(results.appBuildGradle, { [item.source]: {} })
        }
      }
      if (config.project?.plugins?.length) {
        appendPlugin(results.appBuildGradle, config.project.plugins)
      }
      if (config.project?.dependencies?.length) {
        appendSet(results.buildGradle.dependencies, config.project?.dependencies)
      }
      results.filesWrite[resolve(AndroidDir, name, 'build.gradle')] = prepareUtsBuildGradle(config, name)
    } else {
      results.filesWrite[resolve(AndroidDir, name, 'build.gradle')] = prepareUtsBuildGradle({}, name)
    }

    // assets
    const assetsPath = resolve(utsDir, 'assets')
    if (existsSync(assetsPath)) {
      results.filesCopy[resolve(AndroidDir, name, 'src/main/assets')] = assetsPath
    }

    // libs
    const libsPath = resolve(utsDir, 'libs')
    if (existsSync(libsPath)) {
      results.filesCopy[resolve(AndroidDir, name, 'libs')] = libsPath
    }

    // res
    const resPath = resolve(utsDir, 'res')
    if (existsSync(resPath)) {
      results.filesCopy[resolve(AndroidDir, name, 'src/main/res')] = resPath
    }

    // AndroidManifest.xml
    const AndroidManifestPath = resolve(utsDir, 'AndroidManifest.xml')
    if (existsSync(AndroidManifestPath)) {
      results.filesCopy[resolve(AndroidDir, name, 'src/main/AndroidManifest.xml')] = AndroidManifestPath
    } else {
      results.filesWrite[resolve(AndroidDir, name, 'src/main/AndroidManifest.xml')] =
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
</manifest>`
    }

    // src
    const srcPath = resolve(utsDir, 'src')
    if (existsSync(srcPath)) {
      const files = readdirSync(srcPath)
      for (const file of files) {
        results.filesCopy[resolve(AndroidDir, name, 'src/main/java', file)] = resolve(srcPath, file)
      }
    }
  }
}

export interface ConfigJson {
  // 使用NDK时支持的CPU类型，可选（打包时不要复制注释）
  abis?: AndroidAbiFilters[]
  // 依赖的仓储配置，可选，打包时会合并到原生工程的build.gradle中（打包时不要复制注释）
  dependencies?: (string | { id?: string; source?: string })[]
  // Android系统版本要求，最低Android 5.0（打包时不要复制注释）
  minSdkVersion?: number
  project?: {
    plugins?: string[]
    dependencies?: string[]
  }
}

function prepareUtsBuildGradle(config: ConfigJson, name: string) {
  return `plugins {
    id 'com.android.library'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'uniapp.plugin.${name.replace(/[^a-zA-Z]/g, '_')}'
    compileSdkVersion 34

    defaultConfig {
        minSdkVersion ${Math.max(config.minSdkVersion ?? 0, 19)}
        ${
          config.abis?.length
            ? `ndk {
            abiFilters ${[...(config.abis || [])]?.map((item) => `'${item}'`).join(', ')}
        }`
            : ''
        }
    }

    buildTypes {
        release {
            minifyEnabled false
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    compileOnly fileTree(dir: '../app/libs', include: ['*.aar'])
    compileOnly fileTree(dir: 'libs', include: ['*.aar', '*.jar', '*.so'], exclude: [])
    compileOnly 'com.alibaba:fastjson:1.1.46.android'
    compileOnly 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.10'
    compileOnly 'androidx.core:core-ktx:1.6.0'
    compileOnly 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.0'
    compileOnly 'org.jetbrains.kotlin:kotlin-reflect:1.6.0'
    compileOnly 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.8'
    compileOnly 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.8'
}
`
}
