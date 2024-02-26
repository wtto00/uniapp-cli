import { URL, fileURLToPath } from "node:url";
import { extname, resolve } from "node:path";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";

const currentDir = fileURLToPath(new URL("./", import.meta.url));

const distDir = resolve(currentDir, "../dist");

if (!existsSync(distDir)) {
  process.exit(1);
}

const replaceRegex = new RegExp(
  "(?<![\\p{L}\\p{N}_$]|(?<!\\.\\.)\\.)(" +
    Object.keys(process.env)
      .map((key) => `import.meta.env.${key.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}`)
      .join("|") +
    ")(?:(?<=\\.)|(?![\\p{L}\\p{N}_$]|\\s*?=[^=]))",
  "gu"
);

/**
 * replace environment variable name with string value
 * @param {string} jsStr
 */
function replaceEnvVar(jsStr) {
  return jsStr.replace(replaceRegex, (matched) => {
    return JSON.stringify(process.env[matched.substring(16)] ?? "");
  });
}

function removeImportMetaEnv(jsStr) {
  return jsStr.replace(/import\.meta\.env\s*?=\s*?process\.env[;\s]*/g, "");
}

/**
 * Replace json module with json object data
 * @param {string} [basePath=distDir]
 */
function readJsFiles(basePath = distDir) {
  const files = readdirSync(basePath);
  files.forEach((file) => {
    const filePath = resolve(basePath, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      readJsFiles(filePath);
    } else if (extname(filePath) === ".js") {
      // handle js files
      let jsStr = readFileSync(filePath, { encoding: "utf8" });
      let jsReplaced = replaceEnvVar(jsStr);
      jsReplaced = removeImportMetaEnv(jsReplaced);
      if (jsReplaced !== jsStr) {
        writeFileSync(filePath, jsReplaced);
      }
    }
  });
}

readJsFiles();
