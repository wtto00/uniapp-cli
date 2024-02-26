import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseStringPromise, Builder, type ParserOptions, type BuilderOptions } from "xml2js";

export { parseStringPromise, Builder } from "xml2js";

export function xmlParse<T = any>(path: string, optoins?: ParserOptions) {
  if (!existsSync(path)) {
    return Promise.reject(Error(`${path} is not exist.`));
  }
  const str = readFileSync(path, { encoding: "utf8" });
  return parseStringPromise(str, optoins) as Promise<T>;
}

export function xmlBuild(rootObj: any, path: string, options?: BuilderOptions) {
  const build = new Builder(options);
  const xmlStr = build.buildObject(rootObj);
  writeFileSync(path, xmlStr, { encoding: "utf8" });
}
