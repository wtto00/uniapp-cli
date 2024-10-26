import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const packagePath = resolve(import.meta.dirname, '../package.json')
const packageContent = readFileSync(packagePath, 'utf8')
const packages = JSON.parse(packageContent)

const constFilePath = resolve(import.meta.dirname, '../src/utils/const.ts')

const constFileContent = `export const CLI_VERSION = '${packages.version}'`

writeFileSync(constFilePath, constFileContent, { encoding: 'utf8' })
