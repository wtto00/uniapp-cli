export interface Properties {
  features: PropertiesFeatures;
  services: PropertiesServices;
}

export type PropertiesFeatures = Record<string, PropertiesFeature>;

export interface PropertiesFeature {
  value: string;
  features?: PropertiesFeatures;
  module?: Record<string, string>;
}

export type PropertiesServices = Record<string, string>;

export function appendFeature(
  features: PropertiesFeatures,
  feature: {
    name: string;
    value: string;
    features?: PropertiesFeatures;
    module?: Record<string, string>;
  },
) {
  const { name, value, features: featuresChildren, module } = feature;
  if (!features[name]) {
    features[name] = { value };
  } else {
    features[name].value = value;
  }
  if (featuresChildren && Object.keys(featuresChildren).length > 0) {
    if (!features[name].features) features[name].features = {};
    Object.keys(featuresChildren || {}).forEach((key) => {
      appendFeature(features[name].features!, {
        name: key,
        ...featuresChildren[key],
      });
    });
  }
  if (module && Object.keys(module).length > 0) {
    features[name].module = {
      ...features[name].module,
      ...module,
    };
  }
}
