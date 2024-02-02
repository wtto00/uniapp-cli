import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_LARK;

export default {
  getModules: () => ["@dcloudio/uni-mp-lark"],
} as PlatformModule.ModuleClass;
