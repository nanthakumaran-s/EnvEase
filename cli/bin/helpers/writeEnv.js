import fs from "fs";
import path from "path";

export const writeEnv = (envs) => {
  let fileContent = "";
  for (let i = 0; i < envs.length; i++) {
    fileContent += `${envs[i].key}=${envs[i].value}\n`;
  }
  fs.writeFileSync(path.join(process.cwd(), ".env"), fileContent);
};
