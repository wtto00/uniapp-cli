export type MaybePromise<T = void> = T | Promise<T>

export function notInstalledMessage(platform: string) {
  return `平台 ${platform} 还没有安装，请运行 \`uniapp platform add ${platform}\` 添加安装`
}

export function installedMessage(platform: string) {
  return `平台 ${platform} 已安装`
}
