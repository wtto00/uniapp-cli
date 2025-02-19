import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execa } from 'execa'
import { projectDir } from '../const.js'

export function execGradleCommand(projectInfo: ProjectInfo, command: string) {
  const { root } = projectInfo

  const androidProjectPath = join(root, projectDir)

  const isWindows = process.platform === 'win32'
  const gradleExePath = join(androidProjectPath, `gradlew${isWindows ? '.bat' : ''}`)

  if (!existsSync(gradleExePath)) {
    throw Error(`文件 \`${gradleExePath}\` 不存在`)
  }
  return execa({
    stdio: 'inherit',
    env: { FORCE_COLOR: 'true' },
    cwd: androidProjectPath,
  })`${isWindows ? gradleExePath : 'sh'} ${isWindows ? '' : gradleExePath} ${command}`
}
