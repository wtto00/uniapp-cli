declare namespace NodeJS {
  interface Process {
    uniapp?: {
      verbose?: boolean;
    };
  }
}

declare interface Packages {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  optionalDependencies: Record<string, string>;
}

declare type Platform =
  | 'android'
  | 'ios'
  | 'h5'
  | 'mp-weixin'
  | 'mp-alipay'
  | 'mp-baidu'
  | 'mp-toutiao'
  | 'mp-lark'
  | 'mp-qq'
  | 'mp-kuaishou'
  | 'mp-jd'
  | 'mp-360'
  | 'mp-xhs'
  | 'quickapp-union'
  | 'quickapp-huawei';

declare interface PlatformConfig {
  /** module of platform */
  module: string;
  /** platform is support vue3 or not */
  vue3NotSupport?: boolean;
  /** platform require dependencies */
  dependencies?: string[];
  /** platform require environment */
  envs?: string[];
}
