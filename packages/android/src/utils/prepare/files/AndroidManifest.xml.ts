import { generateSpace } from '../space.js'
import { deepMerge, parseXMLProperties } from '../xml.js'

export const AndroidManifestFilePath = 'app/src/main/AndroidManifest.xml'

export interface MetaData {
  resource?: string
  value?: string
  replace?: string
}

export type NodeProperties = Record<string, string>

export interface ActivityIntentFilter {
  /** intent-filter节点属性 */
  properties?: NodeProperties
  /** action节点 */
  action: Set<string>
  /** category节点 */
  category?: Set<string>
  /** data节点 */
  data?: NodeProperties[]
}

export interface Activity {
  /** activity节点属性 */
  properties: NodeProperties
  intentFilter?: ActivityIntentFilter[]
  metaData?: Record<string, MetaData>
}

export interface AndroidManifest {
  package?: string
  /** 权限列表 */
  permissions?: Record<string, NodeProperties>
  /** application节点属性 */
  application: NodeProperties
  /** key为android:name属性值 */
  activity: Record<string, Activity>
  provider?: Record<string, Omit<Activity, 'intentFilter'>>
  /** 所有的activity添加android:taskAffinity="" */
  hasTaskAffinity?: boolean
  /** meta-data节点, key为android:name属性值 */
  metaData?: Record<string, MetaData>
  /** service节点, key为android:name属性值 */
  service?: Record<string, Partial<Activity>>
}

export const defaultAndroidManifest: AndroidManifest = {
  permissions: {
    // 为了兼容android 13 新的权限要求，需要在AndroidManifest.xml 中新增下面的权限声明，以适配图片选择功能。
    // 'android.permission.READ_MEDIA_IMAGES': {},
    // 'android.permission.READ_MEDIA_VIDEO': {},
  },
  application: {
    'android:name': 'io.dcloud.application.DCloudApplication',
    'android:allowClearUserData': 'true',
    'android:icon': '@drawable/icon',
    'android:label': '@string/app_name',
    'android:largeHeap': 'true',
    'android:debuggable': 'true',
  },
  activity: {
    'io.dcloud.PandoraEntry': {
      properties: {
        'android:configChanges': 'orientation|keyboardHidden|keyboard|navigation',
        'android:label': '@string/app_name',
        'android:launchMode': 'singleTask',
        'android:hardwareAccelerated': 'true',
        'android:theme': '@style/TranslucentTheme',
        'android:screenOrientation': 'user',
        'android:windowSoftInputMode': 'adjustResize',
        'android:exported': 'true',
      },
      intentFilter: [
        {
          action: new Set(['android.intent.action.MAIN']),
          category: new Set(['android.intent.category.LAUNCHER']),
        },
      ],
    },
    'io.dcloud.PandoraEntryActivity': {
      properties: {
        'android:launchMode': 'singleTask',
        'android:configChanges':
          'orientation|keyboardHidden|screenSize|mcc|mnc|fontScale|keyboard|smallestScreenSize|screenLayout|screenSize|uiMode',
        'android:hardwareAccelerated': 'true',
        'android:permission': 'com.miui.securitycenter.permission.AppPermissionsEditor',
        'android:screenOrientation': 'user',
        'android:theme': '@style/DCloudTheme',
        'android:windowSoftInputMode': 'adjustResize',
        'android:exported': 'false',
      },
    },
  },
  metaData: {
    // HBuilderX3.5.5+版本默认值调整为none
    DCLOUD_WRITE_EXTERNAL_STORAGE: { value: 'none' },
    // HX3.5.5+版本开始默认策略为none
    DCLOUD_READ_PHONE_STATE: { value: 'none' },
  },
}

export function parsePermissionConfig(permissionsXML?: string[]) {
  const permissions: AndroidManifest['permissions'] = {}
  for (const permissionXML of permissionsXML ?? []) {
    const res = permissionXML.matchAll(/^\s*<(uses-feature|uses-permission)\s+([a-zA-Z:="'._]*)\s*\/>/g)
    for (const line of res) {
      const [, , properties] = line
      if (properties) {
        const { 'android:name': name, ...rest } = parseXMLProperties(properties)
        if (name) {
          permissions[name] = rest
        }
      }
    }
  }
  return permissions
}

export function appendPermissions(manifest: AndroidManifest, permissions: AndroidManifest['permissions']) {
  manifest.permissions = deepMerge(manifest.permissions, permissions)
}

export function mergeActivity<T extends Activity | Partial<Activity> = Activity>(
  activity1?: Record<string, T>,
  activity2?: Record<string, T>,
) {
  const activity: Record<string, T> = {}
  for (const name in activity1) {
    if (activity2?.[name]) {
      activity[name] = {
        properties: {
          ...activity1[name].properties,
          ...activity2[name].properties,
        },
        intentFilter: [...(activity1[name].intentFilter ?? []), ...(activity2[name].intentFilter ?? [])],
        metaData: deepMerge(activity1[name].metaData, activity2[name].metaData),
      } as T
    } else {
      activity[name] = activity1[name]
    }
  }
  for (const name in activity2) {
    if (!activity[name]) {
      activity[name] = activity2[name]
    }
  }
  return activity
}

export function appendActivity(manifest: AndroidManifest, activity?: Record<string, Activity>) {
  manifest.activity = mergeActivity(manifest.activity, activity)
}

export function appendMetaData(manifest: AndroidManifest, metaData?: Record<string, MetaData>) {
  manifest.metaData = deepMerge(manifest.metaData, metaData)
}

export function mergeAndroidManifest(manifest1: Partial<AndroidManifest>, manifest2: Partial<AndroidManifest>) {
  const manifest: AndroidManifest = {
    package: manifest2.package ?? manifest1.package,
    permissions: deepMerge(manifest1.permissions, manifest2.permissions),
    application: { ...manifest1.application, ...manifest2.application },
    activity: mergeActivity(manifest1.activity, manifest2.activity),
    provider: mergeActivity(manifest1.provider, manifest2.provider),
    metaData: deepMerge(manifest1.metaData, manifest2.metaData),
    service: mergeActivity(manifest1.service, manifest2.service),
    hasTaskAffinity: manifest2.hasTaskAffinity ?? manifest1.hasTaskAffinity,
  }
  return manifest
}

export function generateAndroidManifest(_manifest: AndroidManifest) {
  const manifest = mergeAndroidManifest(defaultAndroidManifest, _manifest)
  if (manifest.hasTaskAffinity) {
    for (const name in manifest.activity) {
      manifest.activity[name].properties = {
        ...manifest.activity[name].properties,
        'android:taskAffinity': '',
      }
    }
  }
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${manifest.package ?? ''}">
    
    ${generatePermissions(manifest.permissions)}
    
    <application ${generateProperties(manifest.application)}>
        ${generateActivity(manifest.activity)}
        ${generateActivity(manifest.provider, 'provider')}

        ${genderateMetaData(manifest.metaData, 8)}

        ${generateActivity(manifest.service, 'service')}
    </application>
</manifest>`
}

function getPermissionTag(permission: string) {
  if (permission.startsWith('android.permission')) return 'uses-permission'
  if (permission.startsWith('android.hardware')) return 'uses-feature'
  return ''
}
function generatePermissions(permissions: AndroidManifest['permissions'] = {}) {
  const permissionXML: string[] = []
  for (const name in permissions) {
    const tag = getPermissionTag(name)
    if (tag) {
      permissionXML.push(`<${tag} android:name="${name}" ${generateProperties(permissions[name])}/>`)
    } else {
      const { __tag__, ...properties } = permissions[name]
      if (__tag__) permissionXML.push(`<${__tag__} android:name="${name}" ${generateProperties(properties)}/>`)
    }
  }
  return permissionXML.join('\n    ')
}

function generateProperties(properties?: NodeProperties) {
  if (!properties) return ''
  const propertiesXML: string[] = []
  for (const name in properties) {
    propertiesXML.push(`${name}="${properties[name]}"`)
  }
  return propertiesXML.join(' ')
}

function generateSet(tag: string, set?: Set<string>, space = 16) {
  if (!set) return ''
  const xml: string[] = []
  for (const name of set) {
    xml.push(`<${tag} android:name="${name}" />`)
  }
  return xml.join(`\n${generateSpace(space)}`)
}

function generateIntentFilter(filters: ActivityIntentFilter[] = [], space = 12) {
  const filtersXML: string[] = []
  const spaces = generateSpace(space)
  const spacesSecond = `${spaces}    `
  for (const filter of filters) {
    const children: string[] = [generateSet('action', filter.action)]
    const category = generateSet('category', filter.category)
    if (category) children.push(category)
    if (filter.data) {
      for (const data of filter.data) {
        children.push(`<data ${generateProperties(data)} />`)
      }
    }

    filtersXML.push(`<intent-filter ${generateProperties(filter.properties)}>
${spacesSecond}${children.join(`\n${spacesSecond}`)}
${spaces}</intent-filter>`)
  }
  return filtersXML.join(`\n${spaces}`)
}

function genderateMetaData(metaData: Record<string, MetaData> = {}, space = 12) {
  const metaDataXML: string[] = []
  for (const name in metaData) {
    const properties: string[] = []
    const { resource, value, replace } = metaData[name]
    if (resource) {
      properties.push(`android:resource="${resource}"`)
    }
    if (value) {
      properties.push(`android:value="${value}"`)
    }
    if (replace) {
      properties.push(`tools:replace="${replace}"`)
    }
    metaDataXML.push(`<meta-data android:name="${name}" ${properties.join(' ')} />`)
  }
  return metaDataXML.join(`\n${generateSpace(space)}`)
}

function generateActivity(activity: Record<string, Partial<Activity>> = {}, tag = 'activity') {
  const activityXml: string[] = []
  for (const name in activity) {
    activityXml.push(`<${tag} android:name="${name}" ${generateProperties(activity[name].properties)}>
${generateSpace(12)}${generateIntentFilter(activity[name].intentFilter, 12)}
${generateSpace(12)}${genderateMetaData(activity[name].metaData, 12)}
${generateSpace(8)}</${tag}>`)
  }
  return activityXml.join(`\n\n${generateSpace(8)}`)
}

export function appendService(manifest: AndroidManifest, service: AndroidManifest['service']) {
  manifest.service = mergeActivity(manifest.service, service)
}

export function appendProvider(manifest: AndroidManifest, provider: AndroidManifest['provider']) {
  manifest.provider = mergeActivity(manifest.provider, provider)
}
