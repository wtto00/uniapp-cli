import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_TOUTIAO;

export default {
  getModules: () => ["@dcloudio/uni-mp-toutiao"],
} as PlatformModule.ModuleClass;
