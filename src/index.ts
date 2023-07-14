import { makeCommand } from 'src/command/index';
import { dialogue } from 'src/io/standard_dialogue';
import { createRepository, repositoryDirectory } from 'src/io/file_repository';

const run = async () => {
  const repository = await createRepository(repositoryDirectory);
  const command = makeCommand(dialogue, repository);
  command.parse(process.argv);
};

run();

// TODO
// #!/usr/bin/env node
