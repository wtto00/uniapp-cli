import type { AndroidManifest } from "./templates/AndroidManifest.xml";
import type { AppBuildGradle } from "./templates/app-build.gradle";
import type { BuildGradle } from "./templates/build.gradle";
import type { Properties } from "./templates/dcloud_properties.xml";
import type { Strings } from "./templates/strings.xml";

export interface Results {
  androidManifest: AndroidManifest;
  /** 所需要的依赖文件 */
  libs: Set<string>;
  /** 要写入的的文件 */
  files: Record<string, string>;
  appBuildGradle: AppBuildGradle;
  buildGradle: BuildGradle;
  properties: Properties;
  strings: Strings;
}
