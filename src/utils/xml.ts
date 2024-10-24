/**
 * 'android:name="io.dcloud.application.DCloudApplication" android:allowClearUserData="true"'
 * =>
 * {"android:name":"io.dcloud.application.DCloudApplication","android:allowClearUserData":"true"}
 * @param properties
 */
export function parseXMLProperties(properties: string) {
  const propertiesJson: Record<string, string> = {}
  const arr = properties.split(/\s+/)
  for (const propertie of arr) {
    const [key, value] = propertie.split('=')
    propertiesJson[key] = value
  }
  return propertiesJson
}
