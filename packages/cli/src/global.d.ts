interface Console {
  success: (message?: any) => void;
}

declare namespace PlatformModule {
  import type { PackageJson } from "pkg-types";
  import type { PLATFORM } from "./utils/platform";
  interface ModuleClass {
    getModules: () => string[];
    requirement: () => void;
    beforePlatformAdd?: (packages: PackageJson) => Promise<void>;
    afterPlatformAdd?: (packages: PackageJson) => Promise<void>;
    beforePlatformRemove?: () => Promise<void>;
    platformRemove: () => void;
    afterPlatformRemove?: () => Promise<void>;
    brforeRun?: () => Promise<void>;
    isRunSuccessed?: (platform: PLATFORM, msg: string, output: string[]) => boolean;
    afterRun?: (platform: PLATFORM, msg: string, output: string[]) => void;
  }
}
