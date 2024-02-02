import { PLATFORM } from "../utils/platform";

const pfm = PLATFORM.H5;

export default {
  getModules: () => ["@dcloudio/uni-h5"],
  isRunSuccessed: (platform, msg, output) => /ready in \d+ms./.test(msg),
  afterRun: (platform, msg, output) => {
    const regex = /Local:\s+(http:\/\/localhost:\d+)\//;
    const line = output.find((l) => regex.test(l));
    if (line) {
      const url = line.match(regex)?.[1];
      if (url) {
        import("open").then(({ default: open }) => open(url));
      }
    }
  },
} as PlatformModule.ModuleClass;
