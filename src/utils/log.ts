import chalk from 'chalk'

const Log = {
  info (...props: string[]) {
    console.log(...props)
  },

  warn (...props: string[]) {
    console.log(...props.map((item) => chalk.yellow(item)))
  },

  success (...props: string[]) {
    console.log(...props.map((item) => chalk.green(item)))
  },

  error (...props: string[]) {
    console.log(...props.map((item) => chalk.red(item)))
  },

  debug (...props: string[]) {
    if (process.uniappVerbose ?? false) console.log(...props.map((item) => chalk.grey(item)))
  }
}
export default Log
