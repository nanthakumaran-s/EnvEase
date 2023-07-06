import chalk from "chalk";
import fs from "fs";
import path from "path";

export const readEnv = (loader) => {
  let fileContent = [];
  if (!fs.existsSync(path.join(process.cwd(), ".env"))) {
    loader.fail(chalk.bold.red("No .env file found."));
    process.exit(1);
  }
  let content = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  content = content.toString().split("\n");
  const envs = [];
  for (let i = 0; i < content.length; i++) {
    const obj = {};
    const keyValuePair = content[i].split("=");
    if (
      keyValuePair[0] === "" ||
      keyValuePair[0] === undefined ||
      keyValuePair[1] === undefined
    ) {
      continue;
    }
    obj["key"] = keyValuePair[0].trim();
    obj["value"] = keyValuePair[1].trim();
    envs.push(obj);
  }
  return envs;
};
