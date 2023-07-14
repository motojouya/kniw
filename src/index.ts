import { makeCommand } from 'src/command/index';
import { dialogue } from 'src/io/standard_dialogue';
import { createRepository, repositoryDirectory } from 'src/io/file_repository';

const run = async () => {
  const repository = await createRepository(repositoryDirectory);
  const command = makeCommand(dialogue, repository);
  command.parse(process.argv);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();

// TODO
// #!/usr/bin/env node
