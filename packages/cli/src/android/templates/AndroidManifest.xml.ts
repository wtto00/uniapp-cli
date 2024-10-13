import type { ManifestConfig } from "@uniapp-cli/common";
import { AppPlusOS, PermissionRequest } from "@uniapp-cli/common";

function getPermissions(config: ManifestConfig): string[] {
  const permissions: string[] = [];

  config["app-plus"]?.distribute?.android?.permissions?.forEach((_permission) => {
    const permission = _permission.trim();
    if (permission.startsWith("<uses-permission android:name=")) {
      permissions.push(permission.substring(31, permission.length - 3));
    } else if (permission.startsWith("<uses-feature android:name=")) {
      permissions.push(permission.substring(28, permission.length - 3));
    }
  });

  return permissions;
}

function getPermissionRequest(request: string | undefined, defaultValue: PermissionRequest): PermissionRequest {
  return Object.values(PermissionRequest).includes(request as PermissionRequest)
    ? (request as PermissionRequest)
    : defaultValue;
}

/**
 * 获取已勾选模块所使用的模块
 * @link https://uniapp.dcloud.net.cn/tutorial/app-permission-android.html#modules-permission
 * @param config 用户配置信息
 * @param permissionsDefinded 用户已声明的权限，防止重复
 */
function getModulesPermissons(config: ManifestConfig, permissionsDefinded: string[]): string[] {
  const permissions: Set<string> = new Set();
  const { Geolocation } = config["app-plus"]?.modules || {};
  const { geolocation } = config["app-plus"]?.distribute?.sdkConfigs || {};

  if (Geolocation) {
    if (geolocation?.amap?.__platform__?.includes(AppPlusOS.Android)) {
      // 高德定位
      [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CHANGE_WIFI_STATE",
        "android.permission.READ_PHONE_STATE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.INTERNET",
        "android.permission.MOUNT_UNMOUNT_FILESYSTEMS",
        "android.permission.READ_LOGS",
        "android.permission.WRITE_SETTINGS",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
      ].forEach((permission) => permissions.add(permission));
    }
    if (geolocation?.system?.__platform__?.includes(AppPlusOS.Android)) {
      // 系统定位
      [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CHANGE_WIFI_STATE",
        "android.permission.READ_PHONE_STATE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.INTERNET",
        "android.permission.MOUNT_UNMOUNT_FILESYSTEMS",
        "android.permission.READ_LOGS",
        "android.permission.WRITE_SETTINGS",
      ].forEach((permission) => permissions.add(permission));
    }
  }
  const permissionsXML: string[] = [];
  permissions.forEach((permission) => {
    if (!permissionsDefinded.includes(permission)) {
      if (permission.startsWith("android.permission")) {
        permissionsXML.push(`<uses-permission android:name="${permission}"/>`);
      }
      if (permission.startsWith("android.hardware")) {
        permissionsXML.push(`<uses-feature android:name="${permission}"/>`);
      }
    }
  });
  return permissionsXML;
}

export function generateAndroidManifest(config: ManifestConfig) {
  const permissions = getPermissions(config);

  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${config.package}">

    ${config.permissions?.join("\n    ")}

    ${getModulesPermissons(config, permissions)}

    <application
        android:name="io.dcloud.application.DCloudApplication"
        android:allowClearUserData="true"
        android:icon="@drawable/icon"
        android:label="@string/app_name"
        android:largeHeap="true"
        android:debuggable="true"
        >

        <activity
            android:name="io.dcloud.PandoraEntry"
            android:configChanges="orientation|keyboardHidden|keyboard|navigation"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:hardwareAccelerated="true"
            android:theme="@style/TranslucentTheme"
            android:screenOrientation="user"
            android:windowSoftInputMode="adjustResize" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <meta-data android:name="DCLOUD_WRITE_EXTERNAL_STORAGE" android:value="${getPermissionRequest(
          config["app-plus"]?.distribute?.android?.permissionExternalStorage?.request,
          PermissionRequest.NONE
        )}"/>  
        <meta-data android:name="DCLOUD_READ_PHONE_STATE" android:value="${getPermissionRequest(
          config["app-plus"]?.distribute?.android?.permissionPhoneState?.request,
          PermissionRequest.ONCE
        )}"/>  

    </application>
</manifest>`;
}
