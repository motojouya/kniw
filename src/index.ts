#!/usr/bin/env node

import { makeCommand } from '@motojouya/kniw/src/command/index';
import { dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { createRepository, repositoryDirectory } from '@motojouya/kniw/src/io/file_repository';

const run = async () => {
  const repository = await createRepository(repositoryDirectory);
  const command = makeCommand(dialogue, repository);
  command.parse(process.argv);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
