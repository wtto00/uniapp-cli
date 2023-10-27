import type { Command } from 'commander'
import { resolve } from 'node:path'
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import download from 'download-git-repo'
import inquirer from 'inquirer'
import Log from './utils/log'
import ora from 'ora'
import { createVueProject, installVueCli, isVueCliInstalled } from './utils/exec'

const TEMPLATES = {
  'vue3-ts': 'dcloudio/uni-preset-vue#vite-ts',
  vue3: 'dcloudio/uni-preset-vue#vite',
  'vitesse-uni-app': 'uni-helper/vitesse-uni-app',
  vue2: 'dcloudio/uni-preset-vue',
  'vue3-alpha': 'dcloudio/uni-preset-vue#vite-alpha',
  'vue2-alpha': 'dcloudio/uni-preset-vue#alpha'
}

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
    const { templateKey } = await inquirer.prompt<{ templateKey: keyof typeof TEMPLATES }>([
      {
        type: 'list',
        name: 'templateKey',
        message: 'Please select a project template',
        choices: ['vue3-ts', 'vue3', 'vitesse-uni-app', 'vue2', 'vue3-alpha', 'vue2-alpha'],
        default: 0
      }
    ])
    template = TEMPLATES[templateKey]
    if (templateKey === 'vue2' || templateKey === 'vue2-alpha') {
      Log.debug('create project by @vue/cli')
      if (!isVueCliInstalled()) {
        installVueCli()
      }
      createVueProject(appName, template, force)
      return
    }
  }

  Log.debug(`download template ${template}`)

  const spinner = ora(`downloading template: ${template}`).start()
  try {
    download(template, appName, {}, (err) => {
      if (err != null) {
        spinner.fail(`failed to download ${template}`)
        Log.error(err.message)
      } else spinner.succeed(`Project ${appName} has been successfully created.`)
    })
  } catch (err) {
    spinner.fail(`failed to download ${template}`)
    Log.error((err as Error).message)
  }
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
