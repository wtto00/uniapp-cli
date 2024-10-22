import type { ManifestConfig } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'
import { appendDependencies, appendPackagingOptions } from '../templates/app-build.gradle.js'
import { findLibSDK } from '../utils.js'

export function appendFacialRecognitionVerify(results: Results, manifest: ManifestConfig, sdkVersion: string) {
  const FacialRecognitionVerify = manifest['app-plus']?.modules?.FacialRecognitionVerify
  if (!FacialRecognitionVerify) return

  results.libs.add('uni-facialRecognitionVerify-release.aar')
  if (manifest['app-plus']?.distribute?.android?.abiFilters?.find((item) => item.startsWith('x86'))) {
    results.libs.add('facialRecognitionVerify-support-release.aar')
  }
  const sdkAliyunBase = findLibSDK('aliyun-base-', sdkVersion)
  if (sdkAliyunBase) results.libs.add(sdkAliyunBase)
  const sdkAliyunFacade = findLibSDK('aliyun-facade-', sdkVersion)
  if (sdkAliyunFacade) results.libs.add(sdkAliyunFacade)
  const sdkAliyunFace = findLibSDK('aliyun-face-', sdkVersion)
  if (sdkAliyunFace) results.libs.add(sdkAliyunFace)
  const sdkAliyunFaceaudio = findLibSDK('aliyun-faceaudio-', sdkVersion)
  if (sdkAliyunFaceaudio) results.libs.add(sdkAliyunFaceaudio)
  const sdkAliyunFacelanguage = findLibSDK('aliyun-facelanguage-', sdkVersion)
  if (sdkAliyunFacelanguage) results.libs.add(sdkAliyunFacelanguage)
  const sdkAliyunPhotinus = findLibSDK('aliyun-photinus-', sdkVersion)
  if (sdkAliyunPhotinus) results.libs.add(sdkAliyunPhotinus)
  const sdkAliyunWishverify = findLibSDK('aliyun-wishverify-', sdkVersion)
  if (sdkAliyunWishverify) results.libs.add(sdkAliyunWishverify)
  const sdkAndroidAliyunFaceGuard = findLibSDK('Android-AliyunFaceGuard-', sdkVersion)
  if (sdkAndroidAliyunFaceGuard) results.libs.add(sdkAndroidAliyunFaceGuard)
  const sdkAPSecuritySDKDeepSec = findLibSDK('APSecuritySDK-DeepSec-', sdkVersion)
  if (sdkAPSecuritySDKDeepSec) results.libs.add(sdkAPSecuritySDKDeepSec)

  appendDependencies(results.appBuildGradle, {
    'com.squareup.okhttp3:okhttp:3.11.0': {},
    'com.squareup.okio:okio:1.14.0': {},
    'com.aliyun.dpa:oss-android-sdk:+': {},
  })

  appendPackagingOptions(results.appBuildGradle, ["pickFirst 'lib/*/libc++_shared.so'"])
}
