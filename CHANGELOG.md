# Changelog

## [Unreleased]

### Added

- Android 运行热更新。fixed [#89](https://github.com/wtto00/uniapp-cli/issues/89)
- SDK 下载添加进度显示。fixed [#95](https://github.com/wtto00/uniapp-cli/issues/95)

### Changed

- 使用 `node-fetch` 代替 `fetch`，并添加系统代理的使用。([3757096](https://github.com/wtto00/uniapp-cli/commit/37570967f9d361fa5c38a2288e415ca0cb2eb4d0))
- 文档维护。([d2415f5](https://github.com/wtto00/uniapp-cli/commit/d2415f58042e0c7d7e8ee55795bbd631fc5be61e))
- 更新依赖。

### Security

- Android 热更新启动的 HTTP 文件下载服务器路径匹配不安全。fixed [#1](https://github.com/wtto00/uniapp-cli/security/code-scanning/1)
- Windows 路径正则替换。fixed [#2](https://github.com/wtto00/uniapp-cli/security/code-scanning/2)

## [0.0.3-alpha] - 2024-12-04

### Added

- `Android` 运行打包添加命令行签名参数
- 添加对 `Android` APP 图标配置的支持
- 添加对 `Android` 推送图标配置的支持
- 添加对 `Android` 启动图配置的支持
- `Android` 的 `Activity` 添加 `android:exported` 属性
- 添加 `UTS` 插件的打包支持
- 添加 `Android` 原生插件的打包支持

### Fixed

- 修复测试脚本出错
- 修复添加 `Android` 平台出错
- 修复 `--verbose` 无效的问题
- 修复 `Android` 热线声明配置无效

### Changed

- 一些命令的输出文案优化
- `create` 命令重构，弃用 `@vue/cli`
- `log` 公共方法优化
- `requirement` 命令重构
- 错误输出优化，用户 `Ctrl-C` 主动取消，不要输出错误信息
- `transform` 命令重构，添加对 `vue2` 项目的支持
- 依赖 `inquirer` 更改为 `@inquirer/prompts`
- `bin` 文件修改
- `platform` 命令优化
- `Android` 运行热更新优化
- `Android` 打包依赖升级 `AGP`，从而支持 `JDK17`

## [0.0.2-alpha] - 2024-11-12

### Fixed

- 修复无法使用 `vite` 的模式 `--mode` 参数

### Changed

- `transform` 添加 `--force` 参数

## [0.0.1-alpha] - 2024-11-11

First version.

[unreleased]: https://github.com/wtto00/uniapp-cli/compare/v0.0.3-alpha...HEAD
[0.0.3-alpha]: https://github.com/wtto00/uniapp-cli/releases/tag/v0.0.3-alpha
[0.0.2-alpha]: https://github.com/wtto00/uniapp-cli/releases/tag/v0.0.2-alpha
[0.0.1-alpha]: https://github.com/wtto00/uniapp-cli/releases/tag/v0.0.1-alpha
