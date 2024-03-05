import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import inquirer from "inquirer";
import ora from "ora";
import degit from "degit";
import { projectRoot, createVueProject, installVueCli, isVueCliInstalled } from "@uniapp-cli/common";
import { readPackageJSON, writePackageJSON } from "pkg-types";

const TEMPLATES = {
  "vue3-ts": "dcloudio/uni-preset-vue#vite-ts",
  vue3: "dcloudio/uni-preset-vue#vite",
  "vitesse-uni-app": "uni-helper/vitesse-uni-app",
  vue2: "dcloudio/uni-preset-vue",
  "vue3-alpha": "dcloudio/uni-preset-vue#vite-alpha",
  "vue2-alpha": "dcloudio/uni-preset-vue#alpha",
};

export interface CreateOptoins {
  template?: string;
  force?: boolean;
}

export async function create(appName: string, options: CreateOptoins) {
  const { force } = options;

  const projectPath = resolve(projectRoot, `./${appName}`);

  if (existsSync(projectPath)) {
    if (!(force ?? false)) {
      if (statSync(projectPath).isDirectory() && readdirSync(projectPath).length > 0) {
        process.Log.warn(`directory ${appName} already exists, use \`--force\` to overwrite.`);
        return;
      }
    } else {
      process.Log.info(`delete directory: ${projectPath}`);
      rmSync(projectPath, { force: true, recursive: true });
    }
  }

  let template = options.template ?? "";
  if (template.length === 0) {
    const { templateKey } = await inquirer.prompt<{ templateKey: keyof typeof TEMPLATES }>([
      {
        type: "list",
        name: "templateKey",
        message: "Please select a project template",
        choices: ["vue3-ts", "vue3", "vitesse-uni-app", "vue2", "vue3-alpha", "vue2-alpha"],
        default: 0,
      },
    ]);
    template = TEMPLATES[templateKey];
    if (templateKey === "vue2" || templateKey === "vue2-alpha") {
      process.Log.info("create project by @vue/cli");
      if (!isVueCliInstalled()) {
        installVueCli();
      }
      createVueProject(appName, template, force);
      return;
    }
  }

  process.Log.debug(`download template ${template}`);

  const spinner = ora(`downloading template: ${template}`).start();
  const emitter = degit(template, {
    cache: true,
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
    process.Log.error((err as Error).message);
    process.exit();
  }

  try {
    process.Log.debug(`rename project name to \`${appName}\``);
    const packages = await readPackageJSON(projectPath);
    packages.name = appName;
    await writePackageJSON(resolve(projectPath, "package.json"), packages);
  } catch (err) {
    process.Log.error((err as Error).message);
  }

  process.Log.info(`
Project \`${appName}\` has been created.
Run these commands to start:
    cd ${appName}
    npm i
    uniapp run h5
`);
}
