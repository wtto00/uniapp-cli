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

export function appendSet<T = string>(target: Set<T>, source?: Set<T> | Array<T>) {
  if (source) {
    for (const item of source) {
      target.add(item)
    }
  }
}

export function mergeSet<T = string>(set1?: Set<T>, set2?: Set<T>) {
  const res = new Set<T>()
  if (set1) {
    for (const item of set1) {
      res.add(item)
    }
  }
  if (set2) {
    for (const item of set2) {
      res.add(item)
    }
  }
  return res
}

export function deepMerge<T extends object>(obj1?: T | null, obj2?: T | null): T {
  if (!obj1) return obj2 ?? ({} as T)
  if (!obj2) return obj1 ?? ({} as T)
  const res = {} as T
  for (const key in obj1) {
    if (key in obj2) {
      if (typeof obj1[key] === 'object') {
        res[key] = deepMerge(obj1[key], obj2[key] as object | null) as T[Extract<keyof T, string>]
      } else {
        res[key] = obj2[key]
      }
    } else {
      res[key] = obj1[key]
    }
  }
  for (const key in obj2) {
    if (!(key in obj1)) {
      res[key] = obj2[key]
    }
  }
  return res
}

export function appendMerge<T extends object, D extends keyof T>(data: T, field: D, source: T[D]) {
  if (!data[field]) data[field] = source
  data[field] = deepMerge(data[field] as object | null | undefined, source as object | null | undefined) as T[D]
}
