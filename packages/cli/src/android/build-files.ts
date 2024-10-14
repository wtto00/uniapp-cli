import { type ManifestConfig } from "@uniapp-cli/common";

export function buildBuildGradle(manifest: ManifestConfig) {
  const abiFilters: string[] = manifest["app-plus"].distribute.android.abiFilters || [];
  if (abiFilters.length === 0) {
    abiFilters.push("x86", "x86_64", "armeabi-v7a", "arm64-v8a");
  }

  return `apply plugin: 'com.android.application'

android {
    compileSdkVersion 30
    buildToolsVersion '30.0.3'
    defaultConfig {
        applicationId "${manifest["app-plus"].distribute.android.packagename}"
        minSdkVersion 21
        targetSdkVersion 28
        versionCode ${manifest.versionCode}
        versionName "${manifest.versionName}"
        multiDexEnabled true
        ndk {
            abiFilters ${abiFilters.map((item) => `'${item}'`).join(", ")}
        }
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }
    }
    signingConfigs {
        config {
            keyAlias System.getenv('KEY_ALIAS')
            keyPassword System.getenv('KEY_PASSWORD')
            storeFile file(System.getenv('KEYSTORE_PATH'))
            storePassword System.getenv('STORE_PASSWORD')
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.config
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        release {
            signingConfig signingConfigs.config
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    aaptOptions {
        additionalParameters '--auto-add-overlay'
        ignoreAssetsPattern "!.svn:!.git:.*:!CVS:!thumbs.db:!picasa.ini:!*.scc:*~"
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.aar', '*.jar'], exclude: [])
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.localbroadcastmanager:localbroadcastmanager:1.0.0'
    implementation 'androidx.core:core:1.1.0'
    implementation "androidx.fragment:fragment:1.1.0"
    implementation 'androidx.recyclerview:recyclerview:1.1.0'
    implementation 'com.facebook.fresco:fresco:2.5.0'
    implementation "com.facebook.fresco:animated-gif:2.5.0"
    implementation 'com.github.bumptech.glide:glide:4.9.0'
    implementation 'com.alibaba:fastjson:1.2.83'
    implementation 'androidx.webkit:webkit:1.3.0'
}  
`;
}

function buildSchemes(schemes: string = "") {
  const schemesArr = schemes
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);
  if (schemesArr.length === 0) {
    return `<intent-filter>
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <action android:name="android.intent.action.VIEW" />
            </intent-filter>`;
  }
  return schemesArr
    .map(
      (item) => `<intent-filter>
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <action android:name="android.intent.action.VIEW" />
                <data android:scheme="${item}" />
            </intent-filter>`,
    )
    .join("\n            ");
}

export function buildAndroidManifest(manifest: ManifestConfig) {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${manifest["app-plus"].distribute.android.packagename}">

    ${manifest["app-plus"].distribute.android.permissions.join("\n    ")}

    <application
        android:allowBackup="true"
        android:allowClearUserData="true"
        android:icon="@drawable/icon"
        android:label="@string/app_name"
        android:largeHeap="true"
        android:supportsRtl="true">
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
        <activity
            android:name="io.dcloud.PandoraEntryActivity"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|screenSize|mcc|mnc|fontScale|keyboard|smallestScreenSize|screenLayout|screenSize|uiMode"
            android:hardwareAccelerated="true"
            android:permission="com.miui.securitycenter.permission.AppPermissionsEditor"
            android:screenOrientation="user"
            android:theme="@style/DCloudTheme"
            android:windowSoftInputMode="adjustResize">
            ${buildSchemes(manifest["app-plus"].distribute.android.schemes)}
        </activity>
        <meta-data
            android:name="dcloud_appkey"
            android:value="${manifest["app-plus"].distribute.android.dcloud_appkey}" />
    </application>

</manifest>
`;
}

export function buildStringXml(manifest: ManifestConfig) {
  return `<resources>
    <string name="app_name">${manifest.name}</string>
</resources>
`;
}

export function buildDcloudControlXml(manifest: ManifestConfig) {
  return `<hbuilder>
<apps>
    <app appid="${manifest.appid}" appver="${manifest.versionName}"/>
</apps>
</hbuilder>
`;
}
