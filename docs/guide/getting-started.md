# 快速开始

## 准备

- **Node.js** >= v20
- **Git**

## 安装

::: code-group

```bash [npm]
npm i -g uniapp_cli
```

```bash [pnpm]
pnpm add -g uniapp_cli
```

```bash [yarn]
yarn global add uniapp_cli
```

```bash [bun]
bun install -g uniapp_cli
```

```bash [deno]
deno install -g npm:uniapp_cli
```

:::

## 开始

```bash
uniapp --help
```

```
Usage: uniapp <command> [options]

Options:
  -v, --version                           uniapp_cli 的版本号
  -d, --verbose                           调试模式，输出 debug 级别的日志信息
  -h, --help                              帮助信息

Commands:
  create [options] <project-name>         创建新项目
  requirements|requirement <platform...>  检查给定平台的环境要求
  platform                                管理应用的平台
  run [options] <platform>                开始运行给定的平台
  build [options] <platform>              打包给定的平台
  transform <source> [target]             转换HBuilderX项目到CLI项目
  help [command]                          display help for command
```
