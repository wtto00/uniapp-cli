#!/usr/bin/env node

import { program } from 'commander';

program
  .name('uniapp')
  .version(`uniapp-cli @${require('../package').version}`)
  .usage('<command> [options]')
  .showHelpAfterError(true)
  .showSuggestionAfterError(true);

program
  .command('create')
  .usage('<app-name>')
  .summary('Create a new project')
  .description('create a new project powered by uniapp-cli')
  .argument('<app-name>', 'Human readable name')
  .option(
    '-t, --template',
    'use a custom template from GitHub/GitLab/Bitbucket/Git:url.',
    'dcloudio/uni-preset-vue#vite',
  )
  .option('-f, --force', 'Overwrite target directory if it exists.')
  .allowUnknownOption(true)
  .action((appName, options) => {
    import('./create.js').then(({ run }) => run(appName, options));
  });

program.parse(process.argv);
