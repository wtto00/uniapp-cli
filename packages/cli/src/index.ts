import { program } from "commander";
import { readPackageJSONSync } from "@uniapp-cli/common";
import { resolve } from "node:path";

global.projectRoot = process.cwd();

program
  .name("uniapp")
  .version(`uniapp-cli v${readPackageJSONSync(resolve(import.meta.dirname, "..")).version}`)
  .usage("<command> [options]")
  .option("-d, --verbose", "debug mode produces verbose log output for all activity")
  .helpOption()
  .allowUnknownOption(true)
  .showHelpAfterError(true)
  .showSuggestionAfterError(true);

program
  .command("create")
  .usage("<app-name>")
  .summary("Create a new project")
  .description("Create a new project powered by uniapp-cli.")
  .argument("<app-name>", "Human readable name")
  .option("-t, --template <template>", "use a custom template from GitHub/GitLab/Bitbucket")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("--no-cache", "Overwrite target directory if it exists")
  .addHelpText("after", "\nExample:\n  uniapp create MyUniApp")
  .action((appName, options) => {
    void import("./create.js").then(({ create }) => create(appName, options));
  });

program
  .command("requirements")
  .alias("requirement")
  .usage("<platform ...>")
  .summary("Checks and print out all the requirements for platforms specified")
  .description("Checks and print out all the requirements for platforms specified.")
  .argument("<platform...>", "Platforms requirements you want to check")
  .addHelpText("after", "\nExample:\n  uniapp requirements android")
  .action((platforms) => {
    void import("./requirements.js").then(({ requirements }) => requirements(platforms));
  });

const platform = program
  .command("platform")
  .usage("<command> [options]")
  .summary("Manage project platforms.")
  .description("Manage project platforms.");

platform
  .command("add")
  .usage("<platform...>")
  .summary("Add specified platforms and install them")
  .description("Add specified platforms and install them.")
  .argument("<platform...>", "Specified platforms")
  .action((platforms) => {
    void import("./platform.js").then(({ add }) => add(platforms));
  });
platform
  .command("rm")
  .alias("remove")
  .usage("<platform...>")
  .summary("Remove specified platforms")
  .description("Remove specified platforms.")
  .argument("<platform...>", "Specified platforms")
  .action((platforms) => {
    void import("./platform.js").then(({ remove }) => remove(platforms));
  });
platform
  .command("ls")
  .alias("list")
  .summary("List all installed and available platforms")
  .description("List all installed and available platforms.")
  .action(() => {
    void import("./platform.js").then(({ list }) => list());
  });

program
  .command("run")
  .usage("<platform>")
  .summary("Start development service")
  .description("Start development service with a specified platform.")
  .argument("<platform>", "Specified platforms")
  .option("--no-open", "Do not automatically deploy to a device or emulator")
  .option("--debug", "Deploy a debug build\nOnly available on Android and iOS")
  .option("--release", "Deploy a release build\nOnly available on Android and iOS")
  .addHelpText(
    "after",
    "\nExample:\n  uniapp run android --release --target=myEmulator\n  uniapp run ios --device --debug\n  uniapp run mp-weixin"
  )
  .action((platform, options) => {
    void import("./run.js").then(({ run }) => run(platform, options));
  });

program
  .command("build")
  .usage("<platform>")
  .summary("Build for a specified platform")
  .description("Start development service with a specified platform.")
  .argument("<platform>", "Specified platforms")
  .option("--no-open", "Do not automatically open preview")
  .option("--debug", "Deploy a debug build\nOnly available on Android and iOS")
  .option("--release", "Deploy a release build\nOnly available on Android and iOS")
  .addHelpText(
    "after",
    "\nExample:\n  uniapp build android --release --emulator\n  uniapp build ios --device --debug\n  uniapp build mp-weixin"
  )
  .action((platform, options) => {
    void import("./build.js").then(({ build }) => build(platform, options));
  });

program.parse(process.argv);

global.verbose = program.getOptionValue("verbose");
