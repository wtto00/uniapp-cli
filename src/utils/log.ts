import chalk from 'chalk'
import logSymbols from 'log-symbols'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

const Log = {
  verbose: false,

  debug(...msgs: string[]) {
    if (!Log.verbose) return
    console.log(...msgs.map((msg) => Log.debugColor(msg)))
  },

  info(...msgs: string[] | [{ msg: string; type?: LogLevel }[]]) {
    if (!Array.isArray(msgs[0])) {
      console.log(...msgs)
    } else {
      console.log(
        ...msgs[0].map((item) => {
          switch (item.type) {
            case 'debug':
              return Log.debugColor(item.msg)
            case 'warn':
              return Log.warnColor(item.msg)
            case 'error':
              return Log.errorColor(item.msg)
            case 'success':
              return Log.successColor(item.msg)
            default:
              return item.msg
          }
        }),
      )
    }
  },

  warn(...msgs: string[]) {
    console.log(Log.warnColor(logSymbols.warning), '', ...msgs.map((msg) => Log.warnColor(msg)))
  },

  error(...msgs: string[]) {
    console.log(Log.errorColor(logSymbols.error), '', ...msgs.map((msg) => Log.errorColor(msg)))
  },

  success(...msgs: string[]) {
    console.log(Log.successColor(logSymbols.success), '', ...msgs.map((msg) => Log.successColor(msg)))
  },

  successColor: (text: string) => chalk.green(text),
  errorColor: (text: string) => chalk.red(text),
  warnColor: (text: string) => chalk.yellow(text),
  debugColor: (text: string) => chalk.gray(text),
}

export default Log
