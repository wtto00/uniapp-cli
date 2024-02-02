import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.ANDROID;

export default {
  getModules: () => ["@dcloudio/uni-app-plus", "uniapp-ios"],
} as PlatformModule.ModuleClass;
