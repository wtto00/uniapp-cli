import { isInstalled, installPackages, outputRemoveColor, spawnExec, uninstallPackages, Log } from "@uniapp-cli/common";
import type { ModuleClass } from "./index.js";

const h5: ModuleClass = {
  modules: ["@dcloudio/uni-h5"],

  requirement() {
    Log.success(`${Log.emoji.success} Platform \`h5\` doesn't need any dependency.`);
  },

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run(options) {
    let success = false;
    let over = false;
    const output: string[] = [];
    spawnExec("npx", ["uni", "-p", "h5"], (msg) => {
      if (options.open === false) return;
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms./.test(msg);
      if (!success) return;
      const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
      const line = output.find((l) => regex.test(l));
      if (line) {
        const url = line.match(regex)?.[1];
        if (url) {
          Log.debug("Start open browser.");
          import("open").then(({ default: open }) =>
            open(url)
              .then(() => {
                Log.success("Browser has been opened.");
              })
              .catch(Log.error),
          );
        }
      }
      over = true;
    });
  },

  build(options) {
    let success = false;
    let over = false;
    const output: string[] = [];
    spawnExec("npx", ["uni", "build", "-p", "h5"], (msg) => {
      if (options.open === false) return;
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms./.test(msg);
      if (!success) return;
      const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
      const line = output.find((l) => regex.test(l));
      if (line) {
        const url = line.match(regex)?.[1];
        if (url) {
          Log.debug("Start open browser.");
          import("open").then(({ default: open }) =>
            open(url)
              .then(() => {
                Log.success("Browser has been opened.");
              })
              .catch(Log.error),
          );
        }
      }
      over = true;
    });
  },
};

export default h5;
