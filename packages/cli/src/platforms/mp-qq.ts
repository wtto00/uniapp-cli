import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_QQ;

export default {
  getModules: () => ["@dcloudio/uni-mp-qq"],
} as PlatformModule.ModuleClass;
