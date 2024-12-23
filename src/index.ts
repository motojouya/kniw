#!/usr/bin/env node

import { makeCommand } from '@motojouya/kniw/src/command/index';
import { dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { createDatabase, repositoryDirectory } from '@motojouya/kniw/src/io/file_database';

const run = async () => {
  const repository = await createDatabase(repositoryDirectory);
  const command = makeCommand(dialogue, repository);
  command.parse(process.argv);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
