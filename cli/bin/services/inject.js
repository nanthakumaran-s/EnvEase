import inquirer from "inquirer";
import ora from "ora";
import { checkAuth } from "../helpers/checkAuth.js";
import chalk from "chalk";
import customFetch from "../helpers/customFetch.js";
import { writeEnv } from "../helpers/writeEnv.js";

export const inject = async () => {
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
        projects[i].access === "Read" ||
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
      const response = await customFetch.get("/env", {
        params: {
          projectId: projects[0].id,
          type: type,
        },
      });
      writeEnv(response.data.envs);
      loader.succeed(chalk.bold.green("Injected"));
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
