import chalk from 'chalk'

export const Log = {
  emoji: {
    success: '✅',
    fail: '❌',
  },

  debug(...msgs: string[]) {
    if (!global.verbose) return
    console.log(...msgs.map((msg) => chalk.gray(msg)))
  },

  info(...msgs: string[] | [{ msg: string; type?: 'debug' | 'warn' | 'error' | 'success' }[]]) {
    if (!Array.isArray(msgs[0])) {
      console.log(...msgs)
    } else {
      console.log(
        ...msgs[0].map((item) => {
          switch (item.type) {
            case 'debug':
              return chalk.gray(item.msg)
            case 'warn':
              return chalk.yellow(item.msg)
            case 'error':
              return chalk.red(item.msg)
            case 'success':
              return chalk.green(item.msg)
            default:
              return item.msg
          }
        }),
      )
    }
  },

  warn(...msgs: string[]) {
    console.log(...msgs.map((msg) => chalk.yellow(msg)))
  },

  error(...msgs: string[]) {
    console.log(...msgs.map((msg) => chalk.red(msg)))
  },

  success(...msgs: string[]) {
    console.log(...msgs.map((msg) => chalk.green(msg)))
  },
}
