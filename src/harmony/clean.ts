import { join } from 'node:path'
import { cleanFiles } from '../utils/file.js'
import { HarmonyDir, TemplateDir } from '../utils/path.js'
import { hvigorwClean } from './tools/hvigorw.js'

export async function clean() {
  await cleanFiles(join(TemplateDir, 'harmony'), HarmonyDir, ['oh_modules', '.hvigor', '.idea', 'build'])
}

export async function cleanHvigorw() {
  await hvigorwClean()
}

export async function reset() {
  await cleanFiles(join(TemplateDir, 'harmony'), HarmonyDir)
}
