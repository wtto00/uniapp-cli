import { generateSpace } from '../../utils/space'
import { appendSet } from '../../utils/util'

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
}

export const defaultAppBuildGradle: AppBuildGradle = {
  plugins: new Set(['com.android.application']),
  dependencies: {
    'androidx.recyclerview:recyclerview:1.0.0': {},
    'com.facebook.fresco:fresco:2.5.0': {},
    'com.facebook.fresco:animated-gif:2.5.0': {},

    'androidx.appcompat:appcompat:1.0.0': {},
    'androidx.legacy:legacy-support-v4:1.0.0': {},
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

function mergeField<T extends keyof AppBuildGradle>(
  fieldName: T,
  buildGradle1?: AppBuildGradle,
  buildGradle2?: AppBuildGradle,
): AppBuildGradle[T] {
  return buildGradle2?.[fieldName] ?? buildGradle1?.[fieldName]
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
      dependencies[name] = { exclude: { group: dependencies2[name].exclude?.group } }
    }
  }
  for (const name in dependencies2) {
    if (dependencies[name]) continue
    dependencies[name] = dependencies2[name]
  }
  return dependencies
}

export function mergeAppBuildGradle(buildGradle1?: AppBuildGradle, buildGradle2?: AppBuildGradle) {
  const buildGradle: AppBuildGradle = {
    compileSdkVersion: mergeField('compileSdkVersion', buildGradle1, buildGradle2),
    applicationId: mergeField('applicationId', buildGradle1, buildGradle2),
    minSdkVersion: mergeField('minSdkVersion', buildGradle1, buildGradle2),
    targetSdkVersion: mergeField('targetSdkVersion', buildGradle1, buildGradle2),
    versionCode: mergeField('versionCode', buildGradle1, buildGradle2),
    versionName: mergeField('versionName', buildGradle1, buildGradle2),
    abiFilters: new Set(),
    plugins: new Set(),
    manifestPlaceholders: {
      ...buildGradle1?.manifestPlaceholders,
      ...buildGradle2?.manifestPlaceholders,
    },
    dependencies: mergeDependencies(buildGradle1?.dependencies, buildGradle2?.dependencies),
  }
  appendSet(buildGradle.abiFilters!, buildGradle1?.abiFilters)
  appendSet(buildGradle.abiFilters!, buildGradle2?.abiFilters)
  appendSet(buildGradle.plugins!, buildGradle1?.plugins)
  appendSet(buildGradle.plugins!, buildGradle2?.plugins)
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
    xml.push(`apply plugin: '${plugin}`)
  }
  return xml.join('\n')
}

function genderateAppBuildGradleManifestPlaceholders(manifestPlaceholders?: Record<string, string>) {
  const xml: string[] = []
  for (const key in manifestPlaceholders) {
    xml.push(`"${key}": "${manifestPlaceholders[key]}",`)
  }
  return xml.join(`\n${generateSpace(16)}`)
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

export function appendPackagingOptions(buildGradle: AppBuildGradle, value?: Set<string>) {
  if (!buildGradle.packagingOptions) buildGradle.packagingOptions = new Set()
  appendSet(buildGradle.packagingOptions, value)
}

export function genderateAppBuildGradle(buildGradle: AppBuildGradle) {
  return `${genderateAppBuildGradlePlugins(buildGradle.plugins)}

android {
    compileSdkVersion ${buildGradle.compileSdkVersion}
    buildToolsVersion '30.0.3'
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
        manifestPlaceholders = [
                ${genderateAppBuildGradleManifestPlaceholders(buildGradle.manifestPlaceholders)}
        ]
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }
    }
    signingConfigs {
        config {
            keyAlias System.getenv('KEY_ALIAS')
            keyPassword System.getenv('KEY_PASSWORD')
            storeFile file(System.getenv('KEYSTORE_PATH'))
            storePassword System.getenv('STORE_PASSWORD')
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.config
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        release {
            signingConfig signingConfigs.config
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
    ${buildGradle.packagingOptions && [...buildGradle.packagingOptions].join(`\n${generateSpace(4)}`)}
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
