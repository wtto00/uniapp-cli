interface Console {
  success: (message?: any) => void;
}

declare type MaybePromise<T> = T | Promise<T>;

declare namespace PlatformModule {
  import type { PackageJson } from "pkg-types";
  import type { PLATFORM } from "./utils/platform";
  interface CommonOptions {
    packages: PackageJson;
  }
  interface PlatformAddOptions extends CommonOptions {
    version: string;
  }
  interface ModuleClass {
    modules: string[];
    requirement: () => MaybePromise<void>;
    platformAdd: (options: PlatformAddOptions) => MaybePromise<void>;
    platformRemove: (options: CommonOptions) => MaybePromise<void>;
    run: () => MaybePromise<void>;
  }
}
