import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import inquirer from 'inquirer'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { createVueProject, getErrorMessage, installVueCli, isVueCliInstalled } from './utils/exec.js'
import { Log } from './utils/log.js'
import { App } from './utils/app.js'
import validateProjectName from 'validate-npm-package-name'
import { execa } from 'execa'
import ora from 'ora'
import { getRepoPath } from './utils/git.js'

const TEMPLATES = [
  { name: 'vitesse', repo: 'uni-helper/vitesse-uni-app' },
  {
    name: 'vue3-ts',
    repo: 'dcloudio/uni-preset-vue#vite-ts',
  },
  { name: 'vue3', repo: 'dcloudio/uni-preset-vue#vite' },
  { name: 'vue2', repo: 'dcloudio/uni-preset-vue' },
  { name: 'vue3-alpha', repo: 'dcloudio/uni-preset-vue#vite-alpha' },
  { name: 'vue2-alpha', repo: 'dcloudio/uni-preset-vue#alpha' },
]

export interface CreateOptoins {
  template?: string
  force?: boolean
}

export async function create(projectName: string, options: CreateOptoins) {
  Log.debug(`验证项目名称 ${projectName} 是否有效`)
  const result = validateProjectName(projectName)
  if (!result.validForNewPackages) {
    Log.error(`无效的项目名称: ${projectName}`)
    if (result.errors) {
      for (const err of result.errors) {
        Log.error(`Error: ${err}`)
      }
    }
    if (result.warnings) {
      for (const warn of result.warnings) {
        Log.error(`Warning: ${warn}`)
      }
    }
    return
  }
  Log.debug(`项目名称 ${projectName} 有效`)

  const { force } = options

  const projectPath = resolve(App.projectRoot, projectName)

  if (existsSync(projectPath)) {
    if (!force) {
      Log.error(`\`${projectName}\` 已存在, 使用 \`--force\` 强制覆盖。`)
      return
    }
    const spinner = ora(`使用 \`--force\`，正在删除 \`${projectPath}\``).start()
    rmSync(projectPath, { force: true, recursive: true })
    spinner.succeed(`\`${projectPath}\` 已删除。`)
  }

  let template = options.template ?? ''
  if (!template) {
    const { templateKey } = await inquirer.prompt<{ templateKey: string }>([
      {
        type: 'list',
        name: 'templateKey',
        message: '请选择新建项目的模板',
        choices: TEMPLATES.map((item) => item.name),
        default: 0,
      },
    ])
    template = TEMPLATES.find((item) => item.name === templateKey)?.repo ?? TEMPLATES[0].repo
    if (templateKey === 'vue2' || templateKey === 'vue2-alpha') {
      Log.info('使用 @vue/cli 创建应用')
      if (!(await isVueCliInstalled())) {
        Log.debug('全局安装 @vue/cli')
        await installVueCli()
      }
      await createVueProject(projectName, template, force)
      return
    }
  }

  Log.debug(`克隆仓库 ${template}`)

  const [repo, branch] = template.split('#')

  if (!repo) {
    Log.error('未知的模板仓库')
    return
  }

  const spinner = ora(`正在克隆项目模板: ${template}`).start()
  try {
    await execa`git clone --depth 1 ${branch ? ['-b', branch] : []} ${getRepoPath(repo)} ${projectName}`
    spinner.succeed(`项目模板 ${template} 已克隆完成。`)
  } catch (error) {
    spinner.fail(`克隆项目模板 ${template} 失败了。`)
    Log.error(getErrorMessage(error))
    return
  }

  Log.debug('删除项目模板中的 .git 目录')
  rmSync(resolve(projectPath, '.git'), { force: true, recursive: true })

  try {
    Log.debug(`重命名应用为 \`${projectName}\``)
    const packages = await readPackageJSON(projectPath)
    packages.name = projectName
    await writePackageJSON(resolve(projectPath, 'package.json'), packages)
  } catch (err) {
    Log.error((err as Error).message || '在文件 package.json 中重命名 name 失败。')
  }

  Log.info(`
应用 \`${projectName}\` 创建成功
运行下面的命令开始:
\tcd ${projectName}
\t${App.getPackageManager().name} install
\tuniapp run h5
`)
}
