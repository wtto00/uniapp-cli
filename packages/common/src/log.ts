import chalk, { type ChalkInstance } from 'chalk'
import logSymbols from 'log-symbols'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

const Log = {
  debug(message: string) {
    if (!process.env.DEBUG) return
    console.log(Log.debugColor(message))
  },

  info(message: string | { message: string; type?: LogLevel | ChalkInstance }[] = '') {
    if (!Array.isArray(message)) {
      console.log(message)
    } else {
      console.log(
        message
          .map((item) => {
            if (!item.type) return item.message
            if (typeof item.type === 'string') {
              switch (item.type) {
                case 'debug':
                  return Log.debugColor(item.message)
                case 'warn':
                  return Log.warnColor(item.message)
                case 'error':
                  return Log.errorColor(item.message)
                case 'success':
                  return Log.successColor(item.message)
                default:
                  return item.message
              }
            }
            return item.type(item.message)
          })
          .join(''),
      )
    }
  },

  warn(message: string) {
    console.log(Log.warnMessage(message))
  },

  error(message: string) {
    console.log(Log.errorMessage(message))
  },

  success(message: string) {
    console.log(Log.successMessage(message))
  },

  successMessage: (text: string) => Log.successColor(`${logSymbols.success} ${text}`),
  errorMessage: (text: string) => Log.errorColor(`${logSymbols.error} ${text}`),
  warnMessage: (text: string) => Log.warnColor(`${logSymbols.warning} ${text}`),

  successColor: (text: string) => chalk.green(text),
  errorColor: (text: string) => chalk.red(text),
  warnColor: (text: string) => chalk.yellow(text),
  debugColor: (text: string) => chalk.gray(text),
}

export default Log
