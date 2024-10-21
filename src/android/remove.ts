import { existsSync, rmSync } from "node:fs";
import { androidDir } from "./common.js";

export default function remove() {
  if (existsSync(androidDir)) rmSync(androidDir, { recursive: true, force: true });
}
