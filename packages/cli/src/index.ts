import { program } from "commander";
import { version } from "../package.json";

program
  .name("uni")
  .version(`uniapp-cli v${version}`)
  .usage("<command> [options]")
  .option("-d, --verbose", "debug mode produces verbose log output for all activity")
  .helpOption()
  .allowUnknownOption(true)
  .showHelpAfterError(true)
  .showSuggestionAfterError(true);

program.parse(process.argv);

if (process.argv.length === 2) {
  program.help();
}
