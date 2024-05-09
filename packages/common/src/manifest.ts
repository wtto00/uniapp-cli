import { resolve } from "node:path";
import { projectRoot } from "./path.js";
import { existsSync, readFileSync } from "node:fs";
import * as JSON5 from "json5";
import { Log } from "./log.js";
import type { ManifestConfig } from "./manifest.config.js";

export function getManifestJson() {
  try {
    const manifestPath = resolve(projectRoot, "src/manifest.json");
    if (!existsSync(manifestPath)) {
      Log.warn("File `src/manifest.json` is not exist.");
      return;
    }
    const manifestStr = readFileSync(manifestPath, { encoding: "utf8" });
    return JSON5.parse(manifestStr) as ManifestConfig;
  } catch (error) {
    Log.warn((error as Error).message);
    return;
  }
}
