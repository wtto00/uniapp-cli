# 转换 HBuilderX 项目

使用 `uniapp transform` 把 `HBuilderX` 创建的项目，转换为 `CLI` 项目。

**⚠️ 注意**: 此命令为实验性的，并不保证转换后的项目一定能直接运行成功。一般情况下，可能需要根据不能运行的原因、错误信息等，针对性的稍微修改一下即可。

## 帮助信息

```bash
uniapp help transform
```

```
Usage: uniapp transform <source> [target]

把一个HBuilderX创建的项目，转换为CLI创建的项目

Arguments:
  source       HBuilderX项目所在的目录位置
  target       转换后的CLI项目所在的目录位置。默认为当前目录+原项目目录名

Options:
  -f, --force  如果目录已存在，强制覆盖
  -h, --help   帮助信息

示例:
  uniapp transform project-by-hbuilderx project-by-cli
  uniapp transform project-by-hbuilderx
```

## source

`HBuilderX` 所创建的项目位置，相对于当前目录的位置。

## target

转换后的 `CLI` 项目的位置，相对于当前目录的位置。

可以省略，默认为 `当前目录` + `原项目目录名`

## --force

使用 `-f` 或者 `--force` ，来强制执行操作。

- 如果原项目位置和设定的转换后的项目位置相同，则需要使用此参数来强制修改原项目。
- 如果转换后的项目目录非空，则需要此参数来强制覆盖已存在的目录。
