import { getModuleVersion } from "../utils/package";
import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_XHS;

export default {
  getModules: () => ["@dcloudio/uni-mp-xhs"],
  beforePlatformAdd: async (packages) => {
    const vueVersion = await getModuleVersion(packages, "vue");
    if (vueVersion >= "3") {
      console.error(`Vue3 currently does not support "${pfm}"\n`);
      process.exit();
    }
  },
} as PlatformModule.ModuleClass;