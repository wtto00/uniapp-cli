import { generateSpace } from '../../utils/space'
import { mergeRecord, NodeProperties, parseXMLProperties } from '../../utils/xml'

export interface MetaData {
  resource?: string
  value?: string
}

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
    'android.permission.READ_MEDIA_IMAGES': {},
    'android.permission.READ_MEDIA_VIDEO': {},
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
  permissionsXML?.forEach((permissionXML) => {
    const res = permissionXML.matchAll(/^\s*<(uses-feature|uses-permission)\s+([a-zA-Z:="'\._]*)\s*\/>/g)
    for (const line of res) {
      console.log(line)
      const [, , properties] = line
      if (properties) {
        const { 'android:name': name, ...rest } = parseXMLProperties(properties)
        if (name) {
          permissions[name] = rest
        }
      }
    }
  })
  return permissions
}

export function appendPermissions(manifest: AndroidManifest, permissions: AndroidManifest['permissions']) {
  manifest.permissions = mergeRecord(manifest.permissions, permissions)
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
        metaData: mergeRecord(activity1[name].metaData, activity2[name].metaData),
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
  manifest.metaData = mergeRecord(manifest.metaData, metaData)
}

export function mergeAndroidManifest(manifest1: Partial<AndroidManifest>, manifest2: Partial<AndroidManifest>) {
  const manifest: AndroidManifest = {
    permissions: mergeRecord(manifest1.permissions, manifest2.permissions),
    application: { ...manifest1.application, ...manifest2.application },
    activity: mergeActivity(manifest1.activity, manifest2.activity),
    metaData: mergeRecord(manifest1.metaData, manifest2.metaData),
    service: mergeActivity(manifest1.service, manifest2.service),
    hasTaskAffinity: manifest2.hasTaskAffinity ?? manifest1.hasTaskAffinity,
  }
  return manifest
}

export function generateAndroidManifest(manifest: AndroidManifest) {
  if (manifest.hasTaskAffinity) {
    Object.keys(manifest.activity).forEach((name) => {
      manifest.activity[name].properties = {
        ...manifest.activity[name].properties,
        'android:taskAffinity': '',
      }
    })
  }
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${manifest.package}">
    
    ${generatePermissions(manifest.permissions)}
    
    <application
        ${generateProperties(manifest.application)}>
        ${generateActivity(manifest.activity)}

        ${genderateMetaData(manifest.metaData, 8)}

        ${generateService(manifest.service, 8)}
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
  Object.keys(permissions).forEach((name) => {
    const tag = getPermissionTag(name)
    if (tag) {
      permissionXML.push(`<${tag} android:name="${name}" ${permissions[name] ? '' : 'tools:node="remove" '}/>`)
    }
  })
  return permissionXML.join('\n    ')
}

function generateProperties(properties?: NodeProperties, space = 8) {
  if (!properties) return ''
  const propertiesXML: string[] = []
  Object.keys(properties).forEach((name) => {
    propertiesXML.push(`${name}="${properties[name]}"`)
  })
  return propertiesXML.join(`\n${generateSpace(space)}`)
}

function generateSet(tag: string, set?: Set<string>, space = 16) {
  if (!set) return ''
  const xml: string[] = []
  ;[...set].forEach((name) => {
    xml.push(`<${tag} android:name="${name}" />`)
  })
  return xml.join(`\n${generateSpace(space)}`)
}

function generateIntentFilter(filters: ActivityIntentFilter[] = [], space = 12) {
  const filtersXML: string[] = []
  const spaces = generateSpace(space)
  const spacesSecond = spaces + '    '
  filters.forEach((filter) => {
    const filterProperties = filter.properties ? `\n${spacesSecond}${generateProperties(filter.properties)}` : ''

    const children: string[] = [generateSet('action', filter.action)]
    const category = generateSet('category', filter.category)
    if (category) children.push(category)
    if (filter.data) {
      filter.data.forEach((data) => {
        children.push(`<data ${generateProperties(data)} />`)
      })
    }

    filtersXML.push(`<intent-filter${filterProperties}>
${spacesSecond}${children.join(`\n${spacesSecond}`)}
${spaces}</intent-filter>`)
  })
  return filtersXML.join(`\n${spaces}`)
}

function genderateMetaData(metaData: Record<string, MetaData> = {}, space = 12) {
  const metaDataXML: string[] = []
  Object.keys(metaData).forEach((name) => {
    const properties: string[] = []
    const { resource, value } = metaData[name]
    if (resource) {
      properties.push(`android:resource="${resource}"`)
    }
    if (value) {
      properties.push(`android:value="${value}"`)
    }
    metaDataXML.push(`<meta-data android:name="${name}" ${properties.join(' ')} />`)
  })
  return metaDataXML.join(`\n${generateSpace(space)}`)
}

function generateActivity(activity: AndroidManifest['activity']) {
  const activityXml: string[] = []
  Object.keys(activity).forEach((name) => {
    activityXml.push(`<activity
            android:name="${name}"
            ${generateProperties(activity[name].properties, 12)}>
            ${generateIntentFilter(activity[name].intentFilter, 12)}
            ${genderateMetaData(activity[name].metaData, 12)}
        </activity>`)
  })
  return activityXml.join('\n\n        ')
}

function generateService(service: Record<string, Partial<Activity>> = {}, space = 8) {
  const services: string[] = []
  Object.keys(service).forEach((name) => {
    services.push(`<service android:name="${name}" ${generateProperties(service[name].properties)}>
${generateSpace(space + 4)}${generateIntentFilter(service[name].intentFilter, space + 4)}
${generateSpace(space + 4)}${genderateMetaData(service[name].metaData, space + 4)}
${generateSpace(space)}</service>`)
  })
  return services.join(`\n${generateSpace(space)}`)
}

export function appendService(manifest: AndroidManifest, service: AndroidManifest['service']) {
  manifest.service = mergeRecord(manifest.service, service)
}
