import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { select } from '@inquirer/prompts'
import { Log } from '@wtto00/uniapp-common'
import { execa } from 'execa'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import validateProjectName from 'validate-npm-package-name'
import { App } from './utils/app.js'
import { parseExecaError } from './utils/exec.js'
import { getTemplateRepositoryUrl } from './utils/git.js'
import { showSpinner } from './utils/spinner.js'

export const TEMPLATES = [
  { name: 'vitesse', value: 'uni-helper/vitesse-uni-app' },
  { name: 'vue3-ts', value: 'https://gitee.com/dcloud/uni-preset-vue#vite-ts' },
  { name: 'vue3', value: 'https://gitee.com/dcloud/uni-preset-vue#vite' },
  { name: 'vue2-ts', value: 'https://gitee.com/wtto00/uniapp-template#ts' },
  { name: 'vue2', value: 'https://gitee.com/wtto00/uniapp-template' },
]

export interface CreateOptoins {
  template?: string
  force?: boolean
}

export async function create(projectPath: string, options: CreateOptoins) {
  const projectName = basename(projectPath)
  const result = validateProjectName(projectName)
  if (!result.validForNewPackages) {
    const message = [`无效的项目名称: ${projectName}`]
    if (result.errors) {
      for (const err of result.errors) {
        message.push(`Error: ${err}`)
      }
    }
    if (result.warnings) {
      for (const warn of result.warnings) {
        message.push(`Warning: ${warn}`)
      }
    }
    throw Error(message.join('\n'))
  }

  const { force } = options

  if (existsSync(projectPath)) {
    if (!force) {
      throw Error(`${projectPath} 已存在, 使用 \`--force\` 强制覆盖`)
    }

    await showSpinner(
      () => rm(projectPath, { force: true, recursive: true }),
      {
        start: `使用 \`--force\`，正在删除 \`${projectPath}\``,
        succeed: `${projectPath} 已删除`,
        fail: `${projectPath} 删除出错了`,
      },
      { throw: true },
    )
  }

  let template = options.template ?? ''
  if (!template) {
    const templateKey = await select<string>({
      message: '请选择新建项目的模板',
      choices: TEMPLATES,
      default: 0,
    })
    template = templateKey ?? TEMPLATES[0].value
  } else {
    Log.warn(`正在使用自定义模板 ${template}，请确保拥有模板仓库的访问权限`)
  }

  const [repo, branch] = template.split('#')

  if (!repo) throw Error('未知的模板仓库')

  const templateRepositoryUrl = getTemplateRepositoryUrl(repo)
  await showSpinner(
    () => execa`git clone --depth 1 ${branch ? ['-b', branch] : []} ${templateRepositoryUrl} ${projectPath}`,
    {
      start: `正在克隆项目模板: ${template}`,
      succeed: `项目模板 ${template} 已克隆完成`,
      fail: `克隆项目模板 ${template} 失败了`,
    },
    { throw: true, parseError: parseExecaError },
  )

  await showSpinner(
    async (spinner) => {
      spinner.text = '删除项目模板中的 .git 目录'
      await rm(resolve(projectPath, '.git'), { force: true, recursive: true })
      spinner.text = `重命名模板项目为 ${projectName}`
      const packages = await readPackageJSON(projectPath)
      packages.name = projectName
      await writePackageJSON(resolve(projectPath, 'package.json'), packages)
    },
    {
      start: '处理模板项目文件',
      succeed: `项目 ${projectName} 创建成功`,
    },
    { fail: true },
  )

  Log.info(`
运行以下命令开始吧:
  cd ${projectPath}
  ${App.getPackageManager({ notWarn: true }).name} install
  uniapp run h5
`)
}
