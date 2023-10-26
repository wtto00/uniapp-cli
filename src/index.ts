import { program } from 'commander'
import { version } from '../package.json'
import { initCreateCommand } from './create'
import { initRequirementsCommand } from './requirements'
import { initPlatformCommand } from './platform'

program
  .name('uniapp')
  .version(`uniapp-cli v${version}`)
  .usage('<command> [options]')
  .option('-d, --verbose', 'debug mode produces verbose log output for all activity')
  .allowUnknownOption(true)
  .showHelpAfterError(true)
  .showSuggestionAfterError(true)

process.uniappVerbose = program.opts().verbose

initCreateCommand(program)

initRequirementsCommand(program)

initPlatformCommand(program)
