import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_ALIPAY;

export default {
  getModules: () => ["@dcloudio/uni-mp-alipay"],
} as PlatformModule.ModuleClass;
