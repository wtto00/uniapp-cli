import { type ModuleClass } from "./index.js";

const harmony: ModuleClass = {
  modules: ["@dcloudio/uni-app-harmony", "uniapp-harmony"],

  requirement() {},

  async platformAdd({ version, packages }) {},

  async platformRemove({ packages }) {},

  run(options) {},

  build() {},
};

export default harmony;
