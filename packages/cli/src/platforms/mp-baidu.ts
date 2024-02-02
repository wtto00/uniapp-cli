import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_BAIDU;

export default {
  getModules: () => ["@dcloudio/uni-mp-baidu"],
} as PlatformModule.ModuleClass;
