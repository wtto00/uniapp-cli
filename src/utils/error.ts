import Log from './log.js'

export function error2exit(error: unknown, defaultMessage: string, code = 1) {
  Log.error(errorMessage(error) || defaultMessage)
  process.exit(code)
}

export function errorMessage(error: unknown) {
  return (error as Error).message ?? ''
}
