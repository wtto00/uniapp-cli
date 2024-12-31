# 创建项目

使用 `uniapp create` 快速创建 `uniapp` 项目。

## 帮助信息

```shell
uniapp help create
```

```
Usage: uniapp create <project-path>

使用 uniapp-cli 创建新项目

Arguments:
  project-path               新项目的位置

Options:
  -t, --template <template>  新建项目的模板，是一个 Git 仓库地址
  -f, --force                如果目录已存在，强制覆盖
  -h, --help                 帮助信息

示例:
  uniapp create my-uniapp
  uniapp create my-uniapp -t dcloudio/uni-preset-vue#vite-ts --force
  uniapp create my-uniapp -t https://gitee.com/dcloudio/uni-preset-vue#vite-ts
  uniapp create my-uniapp -t git@gitee.com:dcloudio/uni-preset-vue#vite
```

## 项目名称

`project-name`应用名称有一些规范:

- 应用名称不能为空
- 应用名称所有字母都应该使用小写，即不能使用大写或大小写混合
- 应用名称可以包含连字符 `-`
- 应用名称不能包含不安全的 URL 字符，不能使用中文
- 应用名称不能以 `.` 和 `_` 开头
- 应用名称不能包含空格
- 应用名称不能包含这些字符：`~`,`)`,`(`,`'`,`!`,`*`
- 应用名称不能与`node.js/io.js`核心模块或者保留名称相同。举例以下名称不能使用：
  - http
  - stream
  - node_modules
  - favicon.ico
- 应用名称的长度不能超过 214

## 项目模板

`uniapp-cli` 内置了几种模板:

- [vitesse](https://github.com/uni-helper/vitesse-uni-app): 背靠 `Uni Helper` 团队，告别 `HBuilderX` ，拥抱现代前端开发
- [vue3-ts](https://gitee.com/dcloud/uni-preset-vue/tree/vite-ts): `DCloud` 官方的 `vue3` + `typescript` 模板
- [vue3](https://gitee.com/dcloud/uni-preset-vue/tree/vite): `DCloud` 官方的 `vue3` 模板
- [vue2-ts](https://gitee.com/wtto00/uniapp-template#ts): `DCloud` 官方的 `vue2` + `typescript` 模板
- [vue2](https://gitee.com/wtto00/uniapp-template): `DCloud` 官方的 `vue2` 模板

### 使用 `-t` 或者 ` --template` 参数，可以自定义模板

- 如果是 `Github` 的仓库模板，可以直接使用 `<username>/<repository-name>` 简写，而不需要完整的 `Git` 地址。
- 支持使用 `http/https` 协议的模板仓库地址。
- 支持使用 `git` 协议的仓库地址。
- 支持使用 `ssh` 协议的仓库地址。
- 支持任何 `git clone` 所支持的仓库模板地址。
- 私有的模板仓库，需要保证 `Git` 有访问权限。
- 某些仓库需要先登录，才能克隆，例如 `Gitee` 。如果报错，请配置 `ssh-key` 或在 `Git` 中登录。

**推荐使用 `http/https` 协议的模板仓库地址。**

### 使用 `-f` 或者 `--force` 参数，强制覆盖已存在的相同目录

如果要创建的项目名称在当前目录已存在，可以使用 `-f` 或者 `--force` 参数，此参数会删除原有的同名目录，然后新建项目。

### 使用仓库 `branch` 和 `tag`

可以在模板仓库地址后面加上 `#<branch>` 或者 `#<tag>` 来使用仓库特定的分支或者标签。
