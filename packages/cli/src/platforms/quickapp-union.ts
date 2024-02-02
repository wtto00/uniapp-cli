import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.MP_QUICKAPP_UNION;

export default {
  getModules: () => ["@dcloudio/uni-quickapp-webview"],
} as PlatformModule.ModuleClass;
