import { pathToFileURL } from "node:url";

export async function dynamicImport<T>(filePath: string, notImportDefault?: boolean) {
  const fileUrl = pathToFileURL(filePath);
  const module = await import(fileUrl.toString());
  if (notImportDefault) return module as T;
  return module.default as T;
}
