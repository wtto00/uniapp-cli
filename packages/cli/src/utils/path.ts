import { androidPath } from '@uniapp-cli/common'
import { resolve } from 'node:path'

export const androidDir = resolve(global.projectRoot, androidPath)
