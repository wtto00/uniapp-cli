export function sdkNotFoundMessage(cmd: string, sdkName: string) {
  return `未找到 ${cmd} 可执行文件，请确认已安装 ${sdkName}`
}
