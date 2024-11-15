import Log from './log.js'

export function error2exit(error: unknown, defaultMessage: string, code = 1) {
  Log.error((error as Error).message || defaultMessage)
  process.exit(code)
}
