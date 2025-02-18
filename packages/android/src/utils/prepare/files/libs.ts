import { findLibSDK } from '../lib.js'

export async function getDefaultLibs() {
  const libs = new Set(['lib.5plus.base-release.aar', 'uniapp-v8-release.aar', 'breakpad-build-release.aar'])

  const androidGifDrawableRelease = await findLibSDK('android-gif-drawable-')
  if (androidGifDrawableRelease) libs.add(androidGifDrawableRelease)

  const oaidSdk = await findLibSDK('oaid_sdk_')
  if (oaidSdk) libs.add(oaidSdk)

  return libs
}

export const LibsPath = 'app/libs'
