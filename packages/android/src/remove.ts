import { existsSync, rmSync } from "node:fs";
import { androidDir } from "./common.js";

if (existsSync(androidDir)) rmSync(androidDir, { recursive: true, force: true });
