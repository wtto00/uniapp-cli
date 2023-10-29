exports.indexHelpText = `Usage: uniapp <command> [options]

Options:
  -V, --version                           output the version number
  -d, --verbose                           debug mode produces verbose log output for all activity
  -h, --help                              display help for command

Commands:
  create [options] <app-name>             Create a new project
  requirements|requirement [platform...]  Checks and print out all the requirements for platforms specified.
  platform                                Manage project platforms.
  help [command]                          display help for command
`

exports.createHelpText = `Usage: uniapp create <app-name>

create a new project powered by uniapp-cli

Arguments:
  app-name                   Human readable name

Options:
  -t, --template <template>  use a custom template from
                             GitHub/GitLab/Bitbucket/Git:url.
  -f, --force                Overwrite target directory if it exists.
  -h, --help                 display help for command

Example:
  uniapp create MyUniApp
`
