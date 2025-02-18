import { App } from '@wtto00/uniapp-common'
import { appendDependencies, appendPackagingOptions } from '../files/app-build.gradle.js'
import { findLibSDK } from '../lib.js'
import type { Results } from '../results.js'

export async function appendFacialRecognitionVerify(results: Results) {
  const manifest = await App.getManifestJson()

  const FacialRecognitionVerify = manifest['app-plus']?.modules?.FacialRecognitionVerify
  if (!FacialRecognitionVerify) return

  results.libs.add('uni-facialRecognitionVerify-release.aar')
  if (manifest['app-plus']?.distribute?.android?.abiFilters?.find((item) => item.startsWith('x86'))) {
    results.libs.add('facialRecognitionVerify-support-release.aar')
  }
  const sdkAliyunBase = await findLibSDK('aliyun-base-')
  if (sdkAliyunBase) results.libs.add(sdkAliyunBase)
  const sdkAliyunFacade = await findLibSDK('aliyun-facade-')
  if (sdkAliyunFacade) results.libs.add(sdkAliyunFacade)
  const sdkAliyunFace = await findLibSDK('aliyun-face-')
  if (sdkAliyunFace) results.libs.add(sdkAliyunFace)
  const sdkAliyunFaceaudio = await findLibSDK('aliyun-faceaudio-')
  if (sdkAliyunFaceaudio) results.libs.add(sdkAliyunFaceaudio)
  const sdkAliyunFacelanguage = await findLibSDK('aliyun-facelanguage-')
  if (sdkAliyunFacelanguage) results.libs.add(sdkAliyunFacelanguage)
  const sdkAliyunPhotinus = await findLibSDK('aliyun-photinus-')
  if (sdkAliyunPhotinus) results.libs.add(sdkAliyunPhotinus)
  const sdkAliyunWishverify = await findLibSDK('aliyun-wishverify-')
  if (sdkAliyunWishverify) results.libs.add(sdkAliyunWishverify)
  const sdkAndroidAliyunFaceGuard = await findLibSDK('Android-AliyunFaceGuard-')
  if (sdkAndroidAliyunFaceGuard) results.libs.add(sdkAndroidAliyunFaceGuard)
  const sdkAPSecuritySDKDeepSec = await findLibSDK('APSecuritySDK-DeepSec-')
  if (sdkAPSecuritySDKDeepSec) results.libs.add(sdkAPSecuritySDKDeepSec)

  appendDependencies(results.appBuildGradle, {
    'com.squareup.okhttp3:okhttp:3.11.0': {},
    'com.squareup.okio:okio:1.14.0': {},
    'com.aliyun.dpa:oss-android-sdk:+': {},
  })

  appendPackagingOptions(results.appBuildGradle, ["pickFirst 'lib/*/libc++_shared.so'"])
}
