import { projectRoot, androidPath } from "@uniapp-cli/common";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const currentDir = fileURLToPath(new URL("./", import.meta.url));
export const androidDir = resolve(projectRoot, androidPath);
