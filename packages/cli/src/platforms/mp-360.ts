import { getModuleVersion } from "../utils/package";
import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_360;

export default {
  getModules: () => ["@dcloudio/uni-mp-360"],
  requirement: () => {},
  beforePlatformAdd: async (packages) => {
    const vueVersion = await getModuleVersion(packages, "vue");
    if (vueVersion >= "3") {
      console.error(`Vue3 currently does not support "${pfm}"\n`);
      process.exit();
    }
  },
} as PlatformModule.ModuleClass;
