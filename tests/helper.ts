import { execa, execaSync } from 'execa'

export async function execaUniapp(args: string) {
  return execa`node_modules/.bin/tsx src/index.ts ${args.split(' ')}`
}

export function execaUniappSync(args: string) {
  return execaSync`node_modules/.bin/tsx src/index.ts ${args.split(' ')}`
}
