import chalk, { type ColorName, type BackgroundColorName } from 'chalk'
import logSymbols from 'log-symbols'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

export const Log = {
  verbose: false,

  debug(message: string) {
    if (!Log.verbose) return
    console.log(Log.debugColor(message))
  },

  info(message: string | { message: string; type?: LogLevel | ColorName | BackgroundColorName }[] = '') {
    if (!Array.isArray(message)) {
      console.log(message)
    } else {
      console.log(
        message
          .map((item) => {
            if (!item.type) return item.message
            switch (item.type) {
              case 'debug':
                return Log.debugColor(item.message)
              case 'warn':
                return Log.warnColor(item.message)
              case 'error':
                return Log.errorColor(item.message)
              case 'success':
                return Log.successColor(item.message)
              case 'info':
                return item.message
              default:
                if (item.type in chalk) {
                  return chalk[item.type](item.message)
                }
                return item.message
            }
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
