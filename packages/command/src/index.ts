#!/usr/bin/env node

import { makeCommand } from "./interface/index";
import { dialogue } from "./io/standard_dialogue";
import { createDatabase, repositoryDirectory } from "./io/file_database";

const run = async () => {
  const repository = await createDatabase(repositoryDirectory);
  const command = makeCommand(dialogue, repository);
  command.parse(process.argv);
};

run();
