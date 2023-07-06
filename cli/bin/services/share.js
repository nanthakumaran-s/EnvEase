import ora from "ora";
import { checkAuth } from "../helpers/checkAuth.js";
import chalk from "chalk";
import customFetch from "../helpers/customFetch.js";
import inquirer from "inquirer";
import { readEnv } from "../helpers/readEnv.js";

export const share = async () => {
  const loader = ora();

  if (!checkAuth()) {
    loader.fail(
      chalk.bold.red("You need to authenticate first. Run envease login")
    );
    process.exit(1);
  }

  try {
    const response = await customFetch.get("/project/projects");
    const projects = response.data.projects;
    const projectsToShow = [];

    for (let i = 0; i < projects.length; i++) {
      if (
        projects[i].access === "Write" ||
        projects[i].access === "Read Write"
      ) {
        projectsToShow.push(projects[i].name);
      }
    }

    if (projectsToShow.length === 0) {
      loader.fail(chalk.bold.red("No projects found"));
      process.exit(0);
    }

    const { project } = await inquirer.prompt([
      {
        name: "project",
        message: "Choose project:",
        type: "list",
        choices: projectsToShow,
      },
    ]);

    const { type } = await inquirer.prompt([
      {
        name: "type",
        message: "Choose type:",
        type: "list",
        choices: ["Development", "Testing", "Production"],
      },
    ]);

    loader.start();

    try {
      projects.filter((p) => p.name === project);
      const envs = readEnv(loader);
      for (let i = 0; i < envs.length; i++) {
        await customFetch.post("/env", {
          key: envs[i].key,
          value: envs[i].value,
          projectId: projects[0].id,
          type: type,
        });
      }
      loader.succeed(chalk.bold.green("Shared"));
      process.exit(0);
    } catch (error) {
      loader.fail(chalk.bold.red(error));
      process.exit(1);
    }
  } catch (error) {
    loader.fail(chalk.bold.red(error));
    process.exit(1);
  }
};
