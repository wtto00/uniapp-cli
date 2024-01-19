import { program } from "commander";
import { version } from "../package.json";
import { requirements } from "./requirements";

program
  .name("uni")
  .version(`uniapp-cli v${version}`)
  .usage("<command> [options]")
  .option("-d, --verbose", "debug mode produces verbose log output for all activity")
  .helpOption()
  .allowUnknownOption(true)
  .showHelpAfterError(true)
  .showSuggestionAfterError(true);

program
  .command("requirements")
  .alias("requirement")
  .usage("[platform ...]")
  .summary("Checks and print out all the requirements for platforms specified.")
  .description(
    "Checks and print out all the requirements for platforms specified " +
      "(or all platforms added to project if none specified). " +
      "If all requirements for each platform are met, exits with code 0 otherwise exits with non-zero code."
  )
  .argument("[platform...]", "Platforms requirements you want to check.")
  .addHelpText("after", "\nExample:\n  uniapp requirements android")
  .action((platforms) => {
    void requirements(platforms);
  });

program.parse(process.argv);

if (!program.getOptionValue("verbose")) {
  console.debug = () => {};
}
