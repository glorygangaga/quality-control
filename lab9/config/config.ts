import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export function loadConfig<T>(fileName: string): T {
  const filePath = path.join(
    process.cwd(),
    "config",
    fileName
  );

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return YAML.parse(fileContent) as T;
}