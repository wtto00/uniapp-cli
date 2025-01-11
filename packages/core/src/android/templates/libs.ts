import { App } from '../../utils/app.js'
import { findLibSDK } from '../utils.js'

export function getDefaultLibs() {
  const sdkVersion = App.getUniVersion()
  const libs = new Set(['lib.5plus.base-release.aar', 'uniapp-v8-release.aar', 'breakpad-build-release.aar'])

  const androidGifDrawableRelease = findLibSDK('android-gif-drawable-', sdkVersion)
  if (androidGifDrawableRelease) libs.add(androidGifDrawableRelease)

  const oaidSdk = findLibSDK('oaid_sdk_', sdkVersion)
  if (oaidSdk) libs.add(oaidSdk)

  return libs
}

export const LibsPath = 'app/libs'
