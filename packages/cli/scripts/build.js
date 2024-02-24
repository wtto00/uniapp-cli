import { URL, fileURLToPath } from "node:url";
import { extname, resolve } from "node:path";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";

const currentDir = fileURLToPath(new URL("./", import.meta.url));

const distDir = resolve(currentDir, "../dist");

if (!existsSync(distDir)) {
  process.exit(1);
}

// json cached
const jsonData = {};

/**
 *
 * @param {string} filePath
 */
function patchJsonModules(filePath) {
  const jsStr = readFileSync(filePath, { encoding: "utf8" });
  const jsReplaced = jsStr
    .replace(
      /[;\s]+import\s+\{(\s*?[a-zA-Z_]+[a-zA-Z_0-9]+\s*?)\}\s+from\s+["']([^"']+).json["']/g,
      (matched, varName, jsonPathName, index, input) => {
        const jsonPath = resolve(filePath, "../", `${jsonPathName}.json`);
        if (!jsonData[jsonPath]) {
          const jsonStr = readFileSync(jsonPath, { encoding: "utf8" });
          try {
            jsonData[jsonPath] = JSON.parse(jsonStr);
          } catch (error) {}
        }
        if (jsonData[jsonPath]) {
          const data = jsonData[jsonPath][varName.trim()];
          if (data) {
            const index = matched.indexOf("import");
            const strQuote = typeof data === "string" ? '"' : "";
            return `${matched.substring(0, index)}const ${varName.trim()} = ${strQuote}${
              jsonData[jsonPath][varName.trim()]
            }${strQuote}`;
          }
        }
        return input;
      }
    )
    .replace(
      /[;\s]+import\s+(\s*?[a-zA-Z_]+[a-zA-Z_0-9]+\s*?)\s+from\s+["']([^"']+).json["']/g,
      (matched, varName, jsonPathName, index, input) => {
        const jsonPath = resolve(filePath, "../", `${jsonPathName}.json`);
        if (!jsonData[jsonPath]) {
          const jsonStr = readFileSync(jsonPath, { encoding: "utf8" });
          try {
            jsonData[jsonPath] = JSON.parse(jsonStr);
          } catch (error) {}
        }
        if (jsonData[jsonPath]) {
          const index = matched.indexOf("import");
          return `${matched.substring(0, index)}const ${varName.trim()} = ${JSON.stringify(jsonData[jsonPath])}`;
        }
        return input;
      }
    );
  if (jsReplaced !== jsStr) {
    console.log(`Replace json module imported by ${filePath}`);
    writeFileSync(filePath, jsReplaced);
  }
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
      patchJsonModules(filePath);
    }
  });
}

readJsFiles();
