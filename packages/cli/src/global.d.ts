interface Console {
  success: (message?: any) => void;
}

declare type MaybePromise<T> = T | Promise<T>;

declare namespace UniappCli {
  import type { PackageJson } from "pkg-types";
  import type { PLATFORM } from "./utils/platform.js";
  interface CommonOptions {
    packages: PackageJson;
  }
  interface PlatformAddOptions extends CommonOptions {
    version: string;
  }
  interface RunOptions {
    debug?: boolean;
    release?: boolean;
    device?: boolean;
    emulator?: boolean;
    list?: boolean;
    target?: string;
  }
  interface ModuleClass {
    modules: string[];
    requirement: (options: CommonOptions) => MaybePromise<void>;
    platformAdd: (options: PlatformAddOptions) => MaybePromise<void>;
    platformRemove: (options: CommonOptions) => MaybePromise<void>;
    run: (options: RunOptions) => MaybePromise<void>;
  }
}

namespace NodeJS {
  interface Process {
    Log: import("./utils/log.js").default;
  }
}

interface ImportMeta {
  env: NodeJS.Process["env"];
}
