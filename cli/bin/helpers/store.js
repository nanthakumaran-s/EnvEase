import Configstore from "configstore";
import fs from "fs";
import path from "path";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(path.resolve(), "package.json"), "utf8")
);
const config = new Configstore(packageJson.name);

export const getItem = (key) => {
  return config.get(key);
};

export const setItem = (key, value) => {
  config.set(key, value);
};

export const removeItem = (key) => {
  config.delete(key);
};

export const removeAll = () => {
  config.clear();
};
