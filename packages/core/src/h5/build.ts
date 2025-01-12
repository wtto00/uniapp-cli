import { prepare } from './prepare.js'

export async function build(option: { mode?: string }) {
  await prepare(option)
}
