export function enumInclude<T>(data: Record<string, T>, value: T) {
  return Object.values(data).includes(value)
}

export function trimEnd(source: string | undefined, trimStr: string) {
  if (!source) return source
  let target = source
  while (target.endsWith(trimStr)) {
    target = target.substring(0, target.length - trimStr.length)
  }
  return target
}

export function isWindows() {
  return process.platform === 'win32'
}

export function isDarwin() {
  return process.platform === 'darwin'
}

export function uniRunSuccess(text: string) {
  return /ready in (\d+\.)?\d+m?s\./.test(text)
}
