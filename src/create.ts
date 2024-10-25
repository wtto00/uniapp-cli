import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import degit from 'degit'
import inquirer from 'inquirer'
import ora from 'ora'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { createVueProject, installVueCli, isVueCliInstalled } from './utils/exec.js'
import { Log } from './utils/log.js'
import { projectRoot } from './utils/path.js'

const TEMPLATES = [
  {
    name: 'vue3-ts',
    repo: 'dcloudio/uni-preset-vue#vite-ts',
  },
  { name: 'vue3', repo: 'dcloudio/uni-preset-vue#vite' },
  { name: 'vue2', repo: 'dcloudio/uni-preset-vue' },
  { name: 'vue3-alpha', repo: 'dcloudio/uni-preset-vue#vite-alpha' },
  { name: 'vue2-alpha', repo: 'dcloudio/uni-preset-vue#alpha' },
] as const

export interface CreateOptoins {
  template?: string
  force?: boolean
  cache?: boolean
}

export async function create(appName: string, options: CreateOptoins) {
  const { force, cache } = options

  const projectPath = resolve(projectRoot, `./${appName}`)

  if (existsSync(projectPath)) {
    if (!(force ?? false)) {
      if (statSync(projectPath).isDirectory() && readdirSync(projectPath).length > 0) {
        Log.warn(`文件夹 ${appName} 已存在, 使用 \`--force\` 强制覆盖。`)
        return
      }
    } else {
      Log.info(`删除文件夹: ${projectPath}`)
      rmSync(projectPath, { force: true, recursive: true })
    }
  }

  let template = options.template ?? ''
  if (template.length === 0) {
    const { templateKey } = await inquirer.prompt<{ templateKey: (typeof TEMPLATES)[number]['name'] }>([
      {
        type: 'list',
        name: 'templateKey',
        message: 'Please select a project template',
        choices: TEMPLATES.map((item) => item.name),
        default: 0,
      },
    ])
    template = TEMPLATES.find((item) => item.name === templateKey)?.repo ?? TEMPLATES[0].repo
    if (templateKey === 'vue2' || templateKey === 'vue2-alpha') {
      Log.info('使用@vue/cli创建应用')
      if (!(await isVueCliInstalled())) {
        await installVueCli()
      }
      await createVueProject(appName, template, force)
      return
    }
  }

  Log.debug(`下载应用模板 ${template}`)

  const spinner = ora(`正在下载应用模板: ${template}`).start()
  const emitter = degit(template, {
    cache: cache !== false,
    force: true,
    verbose: true,
  })
  emitter.on('info', (info) => {
    spinner.text = info.message
  })

  try {
    await emitter.clone(appName)
    spinner.succeed(`应用 \`${appName}\` 创建成功。`)
  } catch (err) {
    spinner.fail(`应用模板 \`${template}\` 下载失败。`)
    Log.error((err as Error).message)
    process.exit()
  }

  try {
    Log.debug(`重命名应用为 \`${appName}\``)
    const packages = await readPackageJSON(projectPath)
    packages.name = appName
    await writePackageJSON(resolve(projectPath, 'package.json'), packages)
  } catch (err) {
    Log.error((err as Error).message || '在文件 package.json 中重命名 name 失败。')
  }

  Log.info(`
应用 \`${appName}\` 创建成功
运行下面的命令开始:
\tcd ${appName}
\tnpm i
\tuniapp run h5
`)
}
