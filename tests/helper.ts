import { execa, execaSync } from 'execa'
import { relative, resolve } from 'node:path'

export async function execaUniapp(args: string) {
  const tsxPath = relative(process.cwd(), resolve(import.meta.dirname, '../node_modules/.bin/tsx'))
  const indexPath = relative(process.cwd(), resolve(import.meta.dirname, '../src/index.ts'))
  return execa`${tsxPath} ${indexPath} ${args.split(' ')}`
}

export function execaUniappSync(args: string) {
  const tsxPath = relative(process.cwd(), resolve(import.meta.dirname, '../node_modules/.bin/tsx'))
  const indexPath = relative(process.cwd(), resolve(import.meta.dirname, '../src/index.ts'))
  return execaSync`${tsxPath} ${indexPath} ${args.split(' ')}`
}
