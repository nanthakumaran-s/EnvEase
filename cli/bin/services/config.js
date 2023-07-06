import inquirer from "inquirer";
import ora from "ora";
import customFetch from "../helpers/customFetch.js";
import chalk from "chalk";

import { setItem, removeAll } from "../helpers/store.js";

const loader = ora();

export const login = async () => {
  const { email } = await inquirer.prompt([
    { name: "email", message: "Enter your email:" },
  ]);
  const { password } = await inquirer.prompt([
    { name: "password", message: "Enter your password:", type: "password" },
  ]);

  loader.start();

  try {
    const response = await customFetch.post("/auth/login", {
      email,
      password,
      device: "CLI",
    });
    setItem("tokens", response.data.user.tokens);
    loader.succeed(chalk.bold.green("Authenticated"));
    process.exit(0);
  } catch (error) {
    loader.fail(chalk.bold.red(error));
    process.exit(1);
  }
};

export const logout = () => {
  loader.start();
  removeAll();
  loader.succeed(chalk.bold.green("Logged out"));
  process.exit(0);
};
