import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_KUAISHOU;

export default {
  getModules: () => ["@dcloudio/uni-mp-kuaishou"],
} as PlatformModule.ModuleClass;
