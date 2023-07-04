import { resolve } from 'path';
import download from 'download-git-repo';
import { existsSync, readdirSync, rmSync, statSync } from 'fs';
import chalk from 'chalk';

interface CreateOptions {
  template: string;
  force?: boolean;
}

export function run(appName: string, options: CreateOptions) {
  const { template, force } = options;

  const projectPath = resolve(`./${appName}`);

  if (existsSync(projectPath)) {
    if (!force) {
      if (statSync(projectPath).isDirectory() && readdirSync(projectPath).length > 0) {
        console.log(chalk.yellow(`directory ${appName} already exists, use \`--force\` to overwrite.`));
        return;
      }
    } else {
      rmSync(projectPath, { force: true, recursive: true });
    }
  }
  download(template, appName, (err) => {
    console.log(err);
  });
}
