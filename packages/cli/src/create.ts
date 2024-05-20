import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import inquirer from "inquirer";
import ora from "ora";
import degit from "degit";
import {
  createVueProject,
  installVueCli,
  isVueCliInstalled,
  Log,
  readPackageJSON,
  writePackageJSON,
} from "@uniapp-cli/common";

const TEMPLATES = [
  {
    name: "vue3-ts",
    repo: "dcloudio/uni-preset-vue#vite-ts",
  },
  { name: "vue3", repo: "dcloudio/uni-preset-vue#vite" },
  { name: "vue2", repo: "dcloudio/uni-preset-vue" },
  { name: "vue3-alpha", repo: "dcloudio/uni-preset-vue#vite-alpha" },
  { name: "vue2-alpha", repo: "dcloudio/uni-preset-vue#alpha" },
] as const;

export interface CreateOptoins {
  template?: string;
  force?: boolean;
  cache?: boolean;
}

export async function create(appName: string, options: CreateOptoins) {
  const { force, cache } = options;

  const projectPath = resolve(global.projectRoot, `./${appName}`);

  if (existsSync(projectPath)) {
    if (!(force ?? false)) {
      if (statSync(projectPath).isDirectory() && readdirSync(projectPath).length > 0) {
        Log.warn(`directory ${appName} already exists, use \`--force\` to overwrite.`);
        return;
      }
    } else {
      Log.info(`delete directory: ${projectPath}`);
      rmSync(projectPath, { force: true, recursive: true });
    }
  }

  let template = options.template ?? "";
  if (template.length === 0) {
    const { templateKey } = await inquirer.prompt<{ templateKey: (typeof TEMPLATES)[number]["name"] }>([
      {
        type: "list",
        name: "templateKey",
        message: "Please select a project template",
        choices: TEMPLATES.map((item) => item.name),
        default: 0,
      },
    ]);
    template = TEMPLATES.find((item) => item.name === templateKey)?.repo ?? TEMPLATES[0].repo;
    if (templateKey === "vue2" || templateKey === "vue2-alpha") {
      Log.info("create project by @vue/cli");
      if (!isVueCliInstalled()) {
        installVueCli();
      }
      createVueProject(appName, template, force);
      return;
    }
  }

  Log.debug(`download template ${template}`);

  const spinner = ora(`downloading template: ${template}`).start();
  const emitter = degit(template, {
    cache: cache !== false,
    force: true,
    verbose: true,
  });
  emitter.on("info", (info) => {
    spinner.info(info.message);
  });

  try {
    await emitter.clone(appName);
    spinner.succeed(`Project \`${appName}\` has been successfully created.`);
  } catch (err) {
    spinner.fail(`failed to download \`${template}\``);
    Log.error((err as Error).message);
    process.exit();
  }

  try {
    Log.debug(`rename project to \`${appName}\``);
    const packages = await readPackageJSON(projectPath);
    packages.name = appName;
    await writePackageJSON(resolve(projectPath, "package.json"), packages);
  } catch (err) {
    Log.error((err as Error).message || "Failed to rename project in package.json");
  }

  Log.info(`
Project \`${appName}\` has been created.
Run these commands to start:
    cd ${appName}
    npm i
    uniapp run h5
`);
}
