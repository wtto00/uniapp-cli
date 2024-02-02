import { PLATFORM } from "../utils/platform";
import { resolve } from "node:path";

const pfm = PLATFORM.MP_WEIXIN;

export default {
  getModules: () => ["@dcloudio/uni-mp-weixin"],
  isRunSuccessed: (platform, msg, output) => /ready in \d+ms./.test(msg),
  afterRun(platform, msg, output) {
    console.debug("Start open wechat web devTools.");
    import("miniprogram-automator").then(({ default: automator }) => {
      automator
        .launch({
          cliPath: process.env.WEIXIN_DEV_TOOL,
          projectPath: resolve(process.env.PWD as string, "./dist/dev/mp-weixin"),
        })
        .then(() => {
          console.success("Wechat web devTools has been opened.");
        })
        .catch(console.error);
    });
  },
} as PlatformModule.ModuleClass;
