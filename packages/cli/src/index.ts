import { program } from "commander";
import { version } from "../package.json";
import Log from "./utils/log";

program
  .name("uniapp")
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
  .usage("<platform ...>")
  .summary("Checks and print out all the requirements for platforms specified.")
  .description(
    "Checks and print out all the requirements for platforms specified " +
      "(or all platforms added to project if none specified). " +
      "If all requirements for each platform are met, exits with code 0 otherwise exits with non-zero code."
  )
  .argument("<platform...>", "Platforms requirements you want to check")
  .addHelpText("after", "\nExample:\n  uniapp requirements android")
  .action((platforms) => {
    void import("./requirements").then(({ requirements }) => requirements(platforms));
  });

program
  .command("create")
  .usage("<app-name>")
  .summary("Create a new project.")
  .description("Create a new project powered by uniapp-cli.")
  .argument("<app-name>", "Human readable name")
  .option("-t, --template <template>", "use a custom template from GitHub/GitLab/Bitbucket/Git:url")
  .option("-f, --force", "Overwrite target directory if it exists")
  .addHelpText("after", "\nExample:\n  uniapp create MyUniApp")
  .action((appName, options) => {
    void import("./create").then(({ create }) => create(appName, options));
  });

const platform = program
  .command("platform")
  .usage("<command> [options]")
  .summary("Manage project platforms.")
  .description("Manage project platforms.");

platform
  .command("add")
  .usage("<platform...>")
  .summary("Add specified platforms and install them.")
  .description("Add specified platforms and install them.")
  .argument("<platform...>", "Specified platforms")
  .action((platforms) => {
    void import("./platform").then(({ add }) => add(platforms));
  });
platform
  .command("rm")
  .alias("remove")
  .usage("<platform...>")
  .summary("Remove specified platforms.")
  .description("Remove specified platforms.")
  .argument("<platform...>", "Specified platforms")
  .action((platforms) => {
    void import("./platform").then(({ remove }) => remove(platforms));
  });
platform
  .command("ls")
  .alias("list")
  .summary("List all installed and available platforms.")
  .description("List all installed and available platforms.")
  .action(() => {
    void import("./platform").then(({ list }) => list());
  });

program
  .command("run")
  .usage("<platform>")
  .summary("Start development service")
  .description("Start development service with a specified platform.")
  .argument("<platform>", "Specified platforms")
  .option("--no-open", "Do not automatically open preview")
  .option("--debug", "Deploy a debug build\nOnly available on Android and iOS")
  .option("--release", "Deploy a release build\nOnly available on Android and iOS")
  .option("--device", "Deploy to a device\nOnly available on Android and iOS")
  .option("--emulator", "Deploy to an emulator\nOnly available on Android and iOS")
  .option(
    "--list",
    "Lists available targets\nWill display both device and emulator\nunless --device or --emulator option is provided\nOnly available on Android and iOS"
  )
  .option("--target <target>", "Deploy to a specific target\nOnly available on Android and iOS")
  .addHelpText(
    "after",
    "\nExample:\n  uniapp run android --release --target=myEmulator\n  uniapp run ios --device --debug\n  uniapp run mp-weixin"
  )
  .action((platform, options) => {
    void import("./run").then(({ run }) => run(platform, options));
  });

program.parse(process.argv);

process.Log = new Log(program.getOptionValue("verbose"));
