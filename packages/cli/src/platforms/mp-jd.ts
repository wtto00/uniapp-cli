import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_JD;

export default {
  getModules: () => ["@dcloudio/uni-mp-jd"],
} as PlatformModule.ModuleClass;
