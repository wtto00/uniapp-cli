/**
 * 'android:name="io.dcloud.application.DCloudApplication" android:allowClearUserData="true"'
 * =>
 * {"android:name":"io.dcloud.application.DCloudApplication","android:allowClearUserData":"true"}
 * @param properties
 */
export function parseXMLProperties(properties: string) {
  const propertiesJson: Record<string, string> = {}
  properties.split(/\s+/).forEach((propertie) => {
    const [key, value] = propertie.split('=')
    propertiesJson[key] = value
  })
  return propertiesJson
}

export type NodeProperties = Record<string, string>

/**
 * Record<string,Record<string,any>>
 */
export function mergeRecord<T extends object = NodeProperties>(
  record1?: Record<string, T>,
  record2?: Record<string, T>,
) {
  const metaData: Record<string, T> = {}
  for (const name in record1) {
    metaData[name] = { ...record1[name], ...record2?.[name] }
  }
  for (const name in record2) {
    if (!metaData[name]) {
      metaData[name] = record2[name]
    }
  }
  return metaData
}
