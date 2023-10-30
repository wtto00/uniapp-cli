import type { Command } from 'commander'
import { resolve } from 'node:path'
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import inquirer from 'inquirer'
import Log from './utils/log'
import ora from 'ora'
import degit from 'degit'
import { createVueProject, installVueCli, isVueCliInstalled } from './utils/exec'

interface TemplateItem {
  title: string
  registry: string
  useVueCli?: boolean
}
const allTemplates: TemplateItem[] = [
  { title: 'vue3-ts', registry: 'dcloudio/uni-preset-vue#vite-ts' },
  { title: 'vue3', registry: 'dcloudio/uni-preset-vue#vite' },
  { title: 'vitesse-uni-app', registry: 'uni-helper/vitesse-uni-app' },
  { title: 'vue2', registry: 'dcloudio/uni-preset-vue', useVueCli: true },
  { title: 'vue3-alpha', registry: 'dcloudio/uni-preset-vue#vite-alpha' },
  { title: 'vue2-alpha', registry: 'dcloudio/uni-preset-vue#alpha', useVueCli: true }
]

export interface CreateOptoins {
  template?: string
  force?: boolean
}

export async function create (appName: string, options: CreateOptoins): Promise<void> {
  const { force } = options

  const projectPath = resolve(`./${appName}`)

  if (existsSync(projectPath)) {
    if (!(force ?? false)) {
      if (statSync(projectPath).isDirectory() && readdirSync(projectPath).length > 0) {
        Log.warn(`directory ${appName} already exists, use \`--force\` to overwrite.`)
        return
      }
    } else {
      Log.info(`delete directory: ${projectPath}`)
      rmSync(projectPath, { force: true, recursive: true })
    }
  }

  let template = options.template ?? ''
  if (template.length === 0) {
    const { templateKey } = await inquirer.prompt<{ templateKey: string }>([
      {
        type: 'list',
        name: 'templateKey',
        message: 'Please select a project template',
        choices: allTemplates.map(item => item.title),
        default: 0
      }
    ])
    const templateItem = allTemplates.find(item => item.title === templateKey)
    if (!templateItem) {
      throw Error(`unknown template: ${templateKey}`)
    }
    template = templateItem.registry
    if (templateItem.useVueCli) {
      Log.info('create project by @vue/cli')
      if (!isVueCliInstalled()) {
        installVueCli()
      }
      createVueProject(appName, template, force)
      return
    }
  }

  Log.debug(`download template ${template}`)

  const spinner = ora(`downloading template: ${template}`).start()
  const emitter = degit(template, {
    cache: true,
    force: true,
    verbose: true
  })
  emitter.on('info', info => {
    spinner.info(info.message)
  })

  emitter.clone(appName).then(() => {
    spinner.succeed(`Project ${appName} has been successfully created.`)
  }).catch((err: Error) => {
    spinner.fail(`failed to download ${template}`)
    Log.error((err).message)
  })
}

export function initCreateCommand (program: Command): void {
  program
    .command('create')
    .usage('<app-name>')
    .summary('Create a new project')
    .description('create a new project powered by uniapp-cli')
    .argument('<app-name>', 'Human readable name')
    .option('-t, --template <template>', 'use a custom template from GitHub/GitLab/Bitbucket/Git:url.')
    .option('-f, --force', 'Overwrite target directory if it exists.')
    .addHelpText('after', '\nExample:\n  uniapp create MyUniApp')
    .action((appName, options) => {
      void create(appName, options)
    })
}
