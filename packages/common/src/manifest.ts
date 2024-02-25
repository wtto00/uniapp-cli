import { resolve } from "node:path";
import { projectRoot } from "./path.js";
import { existsSync, readFileSync } from "node:fs";
import JSON5 from "json5";
import type { ManifestConfig } from "@uni-helper/vite-plugin-uni-manifest";

export function getManifestJson() {
  try {
    const manifestPath = resolve(projectRoot, "src/manifest.json");
    if (!existsSync(manifestPath)) {
      process.Log.warn("File `src/manifest.json` is not exist.");
      return;
    }
    const manifestStr = readFileSync(manifestPath, { encoding: "utf8" });
    return JSON5.parse(manifestStr) as ManifestConfig;
  } catch (error) {
    process.Log.warn((error as Error).message);
    return;
  }
}

export type { ManifestConfig } from "@uni-helper/vite-plugin-uni-manifest";
