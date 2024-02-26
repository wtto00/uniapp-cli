import { resolve } from "node:path";
import { projectRoot } from "@uniapp-cli/common";
import { fileURLToPath } from "node:url";

export const currentDir = fileURLToPath(new URL("./", import.meta.url));
export const androidDir = resolve(projectRoot, "platform/android");
