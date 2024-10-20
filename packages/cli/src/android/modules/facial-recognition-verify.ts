import type { ManifestConfig } from '@uniapp-cli/common'
import type { Results } from '../prepare'
import { findLibSDK } from '../utils'
import { appendDependencies, appendPackagingOptions } from '../templates/app-build.gradle'

export function appendFacialRecognitionVerify(results: Results, manifest: ManifestConfig) {
  const FacialRecognitionVerify = manifest['app-plus']?.modules?.FacialRecognitionVerify
  if (!FacialRecognitionVerify) return

  results.libs.add('uni-facialRecognitionVerify-release.aar')
  if (manifest['app-plus']?.distribute?.android?.abiFilters?.find((item) => item.startsWith('x86'))) {
    results.libs.add('facialRecognitionVerify-support-release.aar')
  }
  const sdkAliyunBase = findLibSDK('aliyun-base-')
  if (sdkAliyunBase) results.libs.add(sdkAliyunBase)
  const sdkAliyunFacade = findLibSDK('aliyun-facade-')
  if (sdkAliyunFacade) results.libs.add(sdkAliyunFacade)
  const sdkAliyunFace = findLibSDK('aliyun-face-')
  if (sdkAliyunFace) results.libs.add(sdkAliyunFace)
  const sdkAliyunFaceaudio = findLibSDK('aliyun-faceaudio-')
  if (sdkAliyunFaceaudio) results.libs.add(sdkAliyunFaceaudio)
  const sdkAliyunFacelanguage = findLibSDK('aliyun-facelanguage-')
  if (sdkAliyunFacelanguage) results.libs.add(sdkAliyunFacelanguage)
  const sdkAliyunPhotinus = findLibSDK('aliyun-photinus-')
  if (sdkAliyunPhotinus) results.libs.add(sdkAliyunPhotinus)
  const sdkAliyunWishverify = findLibSDK('aliyun-wishverify-')
  if (sdkAliyunWishverify) results.libs.add(sdkAliyunWishverify)
  const sdkAndroidAliyunFaceGuard = findLibSDK('Android-AliyunFaceGuard-')
  if (sdkAndroidAliyunFaceGuard) results.libs.add(sdkAndroidAliyunFaceGuard)
  const sdkAPSecuritySDKDeepSec = findLibSDK('APSecuritySDK-DeepSec-')
  if (sdkAPSecuritySDKDeepSec) results.libs.add(sdkAPSecuritySDKDeepSec)

  appendDependencies(results.appBuildGradle, {
    'com.squareup.okhttp3:okhttp:3.11.0': {},
    'com.squareup.okio:okio:1.14.0': {},
    'com.aliyun.dpa:oss-android-sdk:+': {},
  })

  appendPackagingOptions(results.appBuildGradle, ["pickFirst 'lib/*/libc++_shared.so'"])
}
