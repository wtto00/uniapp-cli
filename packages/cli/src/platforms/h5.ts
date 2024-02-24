import { installPackages, outputRemoveColor, spawnExec, uninstallPackages } from "../utils/exec.js";
import { isInstalled } from "../utils/package.js";

const h5: UniappCli.ModuleClass = {
  modules: ["@dcloudio/uni-h5"],

  requirement() {},

  platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`));
  },

  platformRemove({ packages }) {
    const filterModules = this.modules.filter((module) => isInstalled(packages, module));
    uninstallPackages(filterModules);
  },

  run() {
    let success = false;
    let over = false;
    let output: string[] = [];
    spawnExec(`npx uni -p h5`, { stdio: "pipe", shell: true }, (msg) => {
      process.Log.info(msg.substring(0, msg.length - 1));
      if (over) return;
      output.push(outputRemoveColor(msg));
      success ||= /ready in \d+ms./.test(msg);
      if (!success) return;
      const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
      const line = output.find((l) => regex.test(l));
      if (line) {
        const url = line.match(regex)?.[1];
        if (url) {
          process.Log.debug("Start open browser.");
          import("open").then(({ default: open }) => open(url));
        }
      }
      over = true;
    });
  },
};

export default h5;
