import { generateSpace } from '../../utils/space.js'

export const PropertiesFilePath = 'app/src/main/assets/data/dcloud_properties.xml'

export interface Properties {
  features: PropertiesFeatures
  services: PropertiesServices
}

export type PropertiesFeatures = Record<string, PropertiesFeature>

export interface PropertiesFeature {
  value: string
  module?: Record<string, string>
}

export type PropertiesServices = Record<string, string>

export function appendFeature(
  properties: Properties,
  feature: {
    name: string
    value: string
    module?: Record<string, string>
  },
) {
  const { name, value, module } = feature
  if (!properties.features[name]) {
    properties.features[name] = { value }
  } else {
    properties.features[name].value = value
  }
  if (module && Object.keys(module).length > 0) {
    properties.features[name].module = {
      ...properties.features[name].module,
      ...module,
    }
  }
}

export const defaultProperties: Properties = {
  features: {
    Console: { value: 'io.dcloud.feature.pdr.LoggerFeatureImpl' },
    Device: { value: 'io.dcloud.feature.device.DeviceFeatureImpl' },
    File: { value: 'io.dcloud.js.file.FileFeatureImpl' },
    Proximity: { value: 'io.dcloud.feature.sensor.ProximityFeatureImpl' },
    Storage: { value: 'io.dcloud.feature.pdr.NStorageFeatureImpl' },
    Cache: { value: 'io.dcloud.feature.pdr.CoreCacheFeatureImpl' },
    Invocation: { value: 'io.dcloud.invocation.Invocation' },
    Navigator: { value: 'io.dcloud.feature.ui.navigator.NavigatorUIFeatureImpl' },
    NativeUI: { value: 'io.dcloud.feature.ui.nativeui.NativeUIFeatureImpl' },
    UI: { value: 'io.dcloud.feature.ui.UIFeatureImpl', module: { Navigator: 'io.dcloud.feature.ui.NavView' } },
    Gallery: { value: 'io.dcloud.js.gallery.GalleryFeatureImpl' },
    Downloader: { value: 'io.dcloud.net.DownloaderFeatureImpl' },
    Uploader: { value: 'io.dcloud.net.UploadFeature' },
    Zip: { value: 'io.dcloud.feature.pdr.ZipFeature' },
    Audio: { value: 'io.dcloud.feature.audio.AudioFeatureImpl' },
    Runtime: { value: 'io.dcloud.feature.pdr.RuntimeFeatureImpl' },
    XMLHttpRequest: { value: 'io.dcloud.net.XMLHttpRequestFeature' },
    Accelerometer: { value: 'io.dcloud.feature.sensor.AccelerometerFeatureImpl' },
    Orientation: { value: 'io.dcloud.feature.sensor.OrientationFeatureImpl' },
    NativeObj: { value: 'io.dcloud.feature.nativeObj.FeatureImpl' },
    Stream: { value: 'io.dcloud.appstream.js.StreamAppFeatureImpl' },
  },
  services: {
    Downloader: 'io.dcloud.net.DownloaderBootImpl',
  },
}

export function mergeProperties(properties1: Properties, properties2: Properties) {
  const properties: Properties = {
    features: {},
    services: {},
  }
  for (const key in properties1.features) {
    appendFeature(properties, {
      name: key,
      ...properties1.features[key],
    })
  }
  for (const key in properties1.services) {
    properties.services[key] = properties1.services[key]
  }
  for (const key in properties2.features) {
    appendFeature(properties, {
      name: key,
      ...properties2.features[key],
    })
  }
  for (const key in properties2.services) {
    properties.services[key] = properties2.services[key]
  }
  return properties
}

function genderateSingleTag(tag: string, records: Record<string, string> = {}, space = 12) {
  const xml: string[] = []
  for (const name in records) {
    xml.push(`<${tag} name="${name}" value="${records[name]}" />`)
  }
  return xml.join(`\n${generateSpace(space)}`)
}

function generateFeatures(features: PropertiesFeatures) {
  const featuresXML: string[] = []
  for (const name in features) {
    const { value, module } = features[name]
    const moduleXML = genderateSingleTag('module', module)
    const end = moduleXML ? `\n${generateSpace(12)}${moduleXML}\n${generateSpace(8)}</feature>` : '/>'
    featuresXML.push(`<feature name="${name}" value="${value}" ${end}`)
  }
  return featuresXML.join(`\n${generateSpace(8)}`)
}

export function generateDcloudProperties(_properties: Properties) {
  const properties = mergeProperties(defaultProperties, _properties)
  return `<properties>
    <features>
        ${generateFeatures(properties.features)}
    </features>
    <services>
        ${genderateSingleTag('service', properties.services, 8)}
    </services>
</properties>`
}
