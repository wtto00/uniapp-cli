const { resolve } = require('path');
const { existsSync, readdirSync, rmSync, statSync } = require('fs');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const Log = require('./log');
const ora = require('ora');

const TEMPLATES = {
  'vue3-ts': 'dcloudio/uni-preset-vue#vite-ts',
  vue3: 'dcloudio/uni-preset-vue#vite',
  vue2: 'dcloudio/uni-preset-vue',
  'vue3-alpha': 'dcloudio/uni-preset-vue#vite-alpha',
  'vue2-alpha': 'dcloudio/uni-preset-vue#alpha',
};

/**
 * create project
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
        Log.warn(`directory ${appName} already exists, use \`--force\` to overwrite.`);
        return;
      }
    } else {
      Log.debug(`delete directory: ${projectPath}`);
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
    template = TEMPLATES[templateKey];
  }

  Log.debug('download template');

  const spinner = ora(`downloading template: ${template}`).start();
  try {
    download(template, appName, {}, (err) => {
      if (err) {
        spinner.fail(`failed to download ${template}`);
        Log.error(err.message);
      } else spinner.succeed(`Project ${appName} has been successfully created.`);
    });
  } catch (err) {
    spinner.fail(`failed to download ${template}`);
    Log.error(err.message);
  }
};
