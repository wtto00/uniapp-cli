import { generateSpace } from '../../utils/space.js'
import { appendSet } from '../../utils/xml.js'

export const AppBuildGradleFilePath = 'app/build.gradle'

export interface AppBuildGradleDependency {
  exclude?: {
    group: string
  }
  project?: boolean
}

export interface AppBuildGradle {
  dependencies?: Record<string, AppBuildGradleDependency>
  manifestPlaceholders?: Record<string, string>
  plugins?: Set<string>
  compileSdkVersion?: number
  applicationId?: string
  minSdkVersion?: number
  targetSdkVersion?: number
  versionCode?: number
  versionName?: string
  abiFilters?: Set<string>
  packagingOptions?: Set<string>
  buildFeatures?: Record<string, boolean>
  channelList?: { id: string; name?: string }[]
}

export const defaultAppBuildGradle: AppBuildGradle = {
  plugins: new Set(['com.android.application']),
  dependencies: {
    'androidx.recyclerview:recyclerview:1.1.0': {},
    'com.facebook.fresco:fresco:2.5.0': {},
    'com.facebook.fresco:animated-gif:2.5.0': {},

    'androidx.appcompat:appcompat:1.1.0': {},
    'androidx.localbroadcastmanager:localbroadcastmanager:1.0.0': {},
    'com.github.bumptech.glide:glide:4.9.0': {},
    'com.alibaba:fastjson:1.2.83': {},
    'androidx.webkit:webkit:1.3.0': {},
  },
  // 4.06更新为34，3.8.12更新为33
  compileSdkVersion: 34,
  minSdkVersion: 21,
  targetSdkVersion: 30,
  versionName: '1.0.0',
  versionCode: 1000000,
}

export function mergeField<T extends keyof AppBuildGradle>(
  name: T,
  gradle1?: AppBuildGradle,
  gradle2?: AppBuildGradle,
): AppBuildGradle[T] {
  return gradle2?.[name] ?? gradle1?.[name]
}

export function mergeNumberField<T extends 'compileSdkVersion' | 'minSdkVersion' | 'targetSdkVersion' | 'versionCode'>(
  name: T,
  gradle1?: AppBuildGradle,
  gradle2?: AppBuildGradle,
): number {
  if (!gradle1?.[name]) return gradle2?.[name] as number
  if (!gradle2?.[name]) return gradle1?.[name] as number
  return Math.max(gradle1[name], gradle2[name])
}

export function appendPlugin(buildGradle: AppBuildGradle, plugins?: Set<string> | Array<string>) {
  if (!buildGradle.plugins) buildGradle.plugins = new Set()
  appendSet(buildGradle.plugins, plugins)
}

export function mergeDependencies(
  dependencies1?: Record<string, AppBuildGradleDependency>,
  dependencies2?: Record<string, AppBuildGradleDependency>,
) {
  const dependencies: Record<string, AppBuildGradleDependency> = {}
  for (const name in dependencies1) {
    if (!dependencies2?.[name]) {
      dependencies[name] = dependencies1[name]
    } else if (!dependencies1[name].exclude?.group || !dependencies2[name].exclude?.group) {
      dependencies[name] = {}
    } else {
      dependencies[name] = {
        exclude: { group: dependencies2[name].exclude?.group ?? dependencies1[name].exclude?.group },
      }
    }
  }
  for (const name in dependencies2) {
    if (dependencies[name]) continue
    dependencies[name] = dependencies2[name]
  }
  return dependencies
}

export function appendDependencies(
  buildGradle: AppBuildGradle,
  dependencies?: Record<string, AppBuildGradleDependency>,
) {
  buildGradle.dependencies = mergeDependencies(buildGradle.dependencies, dependencies)
}

export function mergeAppBuildGradle(buildGradle1?: AppBuildGradle, buildGradle2?: AppBuildGradle) {
  const buildGradle: AppBuildGradle = {
    compileSdkVersion: mergeNumberField('compileSdkVersion', buildGradle1, buildGradle2),
    applicationId: mergeField('applicationId', buildGradle1, buildGradle2),
    minSdkVersion: mergeNumberField('minSdkVersion', buildGradle1, buildGradle2),
    targetSdkVersion: mergeNumberField('targetSdkVersion', buildGradle1, buildGradle2),
    versionCode: buildGradle2?.versionCode || buildGradle1?.versionCode,
    versionName: mergeField('versionName', buildGradle1, buildGradle2),
    abiFilters: new Set(),
    plugins: new Set(),
    manifestPlaceholders: {
      ...buildGradle1?.manifestPlaceholders,
      ...buildGradle2?.manifestPlaceholders,
    },
    dependencies: mergeDependencies(buildGradle1?.dependencies, buildGradle2?.dependencies),
    packagingOptions: new Set(),
    buildFeatures: {
      ...buildGradle1?.buildFeatures,
      ...buildGradle2?.buildFeatures,
    },
  }
  appendSet(buildGradle.abiFilters!, buildGradle1?.abiFilters)
  appendSet(buildGradle.abiFilters!, buildGradle2?.abiFilters)
  appendSet(buildGradle.plugins!, buildGradle1?.plugins)
  appendSet(buildGradle.plugins!, buildGradle2?.plugins)
  appendSet(buildGradle.packagingOptions!, buildGradle1?.packagingOptions)
  appendSet(buildGradle.packagingOptions!, buildGradle2?.packagingOptions)
  for (const dependencie in buildGradle1?.dependencies) {
    if (buildGradle2?.dependencies?.[dependencie]) {
    }
  }
  return buildGradle
}

function genderateAppBuildGradlePlugins(plugins?: Set<string>) {
  if (!plugins) return ''
  const xml: string[] = []
  for (const plugin of plugins) {
    xml.push(`apply plugin: '${plugin}'`)
  }
  return xml.join('\n')
}

function genderateAppBuildGradleManifestPlaceholders(manifestPlaceholders: Record<string, string> = {}) {
  const xml: string[] = []
  for (const key in manifestPlaceholders) {
    xml.push(`"${key}": "${manifestPlaceholders[key]}",`)
  }
  if (xml.length === 0) return ''
  return `manifestPlaceholders = [
${generateSpace(12)}${xml.join(`\n${generateSpace(12)}`)}
${generateSpace(8)}]`
}

function genderateAppBuildGradleDependencies(dependencies?: Record<string, AppBuildGradleDependency>) {
  const xml: string[] = []
  for (const name in dependencies) {
    if (dependencies[name].exclude?.group) {
      xml.push(`implementation('${name}'){ exclude(group: '${dependencies[name].exclude.group}') }`)
    } else if (dependencies[name].project) {
      xml.push(`implementation project('${name}')`)
    } else {
      xml.push(`implementation '${name}'`)
    }
  }
  return xml.join(`\n${generateSpace(4)}`)
}

export function appendPackagingOptions(buildGradle: AppBuildGradle, value?: Set<string> | Array<string>) {
  if (!buildGradle.packagingOptions) buildGradle.packagingOptions = new Set()
  appendSet(buildGradle.packagingOptions, value)
}

function genderatePackagingOptions(packagingOptions?: AppBuildGradle['packagingOptions']) {
  if (!packagingOptions) return ''
  const xml: string[] = []
  for (const item of packagingOptions) {
    xml.push(item)
  }
  return xml.join(`\n${generateSpace(4)}`)
}

function generateBuildFeatures(buildFeatures?: AppBuildGradle['buildFeatures']) {
  if (!buildFeatures) return ''
  const xml: string[] = []
  for (const key in buildFeatures) {
    if (buildFeatures[key]) xml.push(`${key} = ${buildFeatures[key]}`)
  }
  return xml.join(`\n${generateSpace(4)}`)
}

export function genderateAppBuildGradle(_buildGradle: AppBuildGradle) {
  const buildGradle = mergeAppBuildGradle(defaultAppBuildGradle, _buildGradle)
  return `${genderateAppBuildGradlePlugins(buildGradle.plugins)}

android {
    compileSdkVersion ${buildGradle.compileSdkVersion}
    buildToolsVersion '34.0.0'
    namespace '${buildGradle.applicationId}'
    defaultConfig {
        applicationId "${buildGradle.applicationId}"
        minSdkVersion ${buildGradle.minSdkVersion}
        targetSdkVersion ${buildGradle.targetSdkVersion}
        versionCode ${buildGradle.versionCode}
        versionName "${buildGradle.versionName}"
        multiDexEnabled true
        ndk {
            abiFilters ${[...(buildGradle.abiFilters || [])]?.map((item) => `'${item}'`).join(', ')}
        }
        ${genderateAppBuildGradleManifestPlaceholders(buildGradle.manifestPlaceholders)}
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }
    }
    def keystorePath = System.getenv('KEYSTORE_PATH') ?: null
    signingConfigs {
        config {
            if (keystorePath != null) {
                keyAlias System.getenv('KEY_ALIAS')
                keyPassword System.getenv('KEY_PASSWORD')
                storeFile file(System.getenv('KEYSTORE_PATH'))
                storePassword System.getenv('STORE_PASSWORD')
                v1SigningEnabled true
                v2SigningEnabled true
            }
        }
    }
    buildTypes {
        debug {
            if (keystorePath != null) {
                signingConfig signingConfigs.config
            }
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        release {
            if (keystorePath != null) {
                signingConfig signingConfigs.config
            }
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
    aaptOptions {
        additionalParameters '--auto-add-overlay'
        //noCompress 'foo', 'bar'
        ignoreAssetsPattern "!.svn:!.git:.*:!CVS:!thumbs.db:!picasa.ini:!*.scc:*~"
    }
    ${genderatePackagingOptions(buildGradle.packagingOptions)}
    ${generateBuildFeatures(buildGradle.buildFeatures)}
}
repositories {
    flatDir {
        dirs 'libs'
    }
}
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.aar', '*.jar'], exclude: [])

    ${genderateAppBuildGradleDependencies(buildGradle.dependencies)}
}
`
}
