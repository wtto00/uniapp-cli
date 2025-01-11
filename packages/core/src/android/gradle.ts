import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { AndroidDir } from '../utils/path.js'
import { isWindows } from '../utils/util.js'

export function getGradleExePath() {
  const gradleExePath = resolve(AndroidDir, `gradlew${isWindows() ? '.bat' : ''}`)
  if (!existsSync(gradleExePath)) {
    throw Error(`文件 \`${gradleExePath}\` 不存在`)
  }
  return gradleExePath
}
