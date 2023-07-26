const { resolve } = require('path');
const { existsSync, readdirSync, rmSync, statSync } = require('fs');
const download = require('download-git-repo');
const chalk = require('chalk');
const inquirer = require('inquirer');
const log = require('./log');
const ora = require('ora');

const templates = {
  'vue3-ts': 'dcloudio/uni-preset-vue#vite-ts',
  vue3: 'dcloudio/uni-preset-vue#vite',
  vue2: 'dcloudio/uni-preset-vue',
  'vue3-alpha': 'dcloudio/uni-preset-vue#vite-alpha',
  'vue2-alpha': 'dcloudio/uni-preset-vue#alpha',
};

/**
 * 创建项目工程
 * @param {string} appName
 * @param {{template: string;force?: boolean;}} options
 * @returns
 */
module.exports = async function create(appName, options) {
  const { force } = options;

  const projectPath = resolve(`./${appName}`);

  if (existsSync(projectPath)) {
    if (!force) {
      if (statSync(projectPath).isDirectory() && readdirSync(projectPath).length > 0) {
        log(chalk.yellow(`directory ${appName} already exists, use \`--force\` to overwrite.`));
        return;
      }
    } else {
      log(`delete directory: ${projectPath}`, true);
      rmSync(projectPath, { force: true, recursive: true });
    }
  }

  let template = options.template;
  if (!template) {
    const { templateKey } = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateKey',
        message: 'Please select a project template',
        choices: ['vue3-ts', 'vue3', 'vue2', 'vue3-alpha', 'vue2-alpha'],
        default: 0,
      },
    ]);
    template = templates[templateKey];
  }

  log('download template', true);

  const spinner = ora(`downloading template: ${template}`).start();
  download(template, appName, {}, (err) => {
    if (err) spinner.fail(err.message);
    else spinner.succeed(`Project ${appName} has been successfully created.`);
  });
};
