import Log from './log.js'

export function error2exit(error: unknown, defaultMessage: string, code = 1) {
  const message = errorMessage(error)
  if (message !== 'User force closed the prompt with 0 null') {
    Log.error(message || defaultMessage)
  }
  process.exit(code)
}

export function errorMessage(error: unknown) {
  return (error as Error).message ?? ''
}

export function errorDebugLog(error: unknown) {
  Log.debug((error as Error).toString())
}
