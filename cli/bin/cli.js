#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { login, logout } from "./services/config.js";
import { inject } from "./services/inject.js";

yargs(hideBin(process.argv))
  .command("login", "Login to EnvEase CLI", login)
  .parse();

yargs(hideBin(process.argv))
  .command("logout", "Logout from EnvEase CLI", logout)
  .parse();

yargs(hideBin(process.argv))
  .command("inject", "Inject environment variables", inject)
  .parse();
