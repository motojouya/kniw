import commander from 'commander';
import { list } from 'src/case/party/list';
import { showStatus } from 'src/case/party/showStatus';
import { build } from 'src/case/party/build';
import { change } from 'src/case/party/change';
import { dismiss } from 'src/case/party/dismiss';
import { exportJson } from 'src/case/party/exportJson';
import { dialogue } from 'src/io/standard_dialogue';
import { createRepository, repositoryDirectory } from 'src/io/file_repository';

const program = new commander.Command();

const party = program.command('party');

party
  .command('list')
  .description('list parties')
  .action(async () => {
    const repository = await createRepository(repositoryDirectory);
    await list(dialogue, repository);
  });

party
  .command('build')
  .argument('<name>', 'building party name')
  .description('build a party as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await build(dialogue, repository)(name as string);
  });

party
  .command('status')
  .argument('<name>', 'party name you looking')
  .description('look party as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await showStatus(dialogue, repository)(name as string);
  });

party
  .command('change')
  .argument('<name>', 'changing party name')
  .description('change a party as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await change(dialogue, repository)(name as string);
  });

party
  .command('dismiss')
  .argument('<name>', 'dismiss party name')
  .description('dismiss party as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await dismiss(dialogue, repository)(name as string);
  });

party
  .command('export')
  .argument('<name>', 'export party name')
  .argument('<file>', 'export file')
  .description('export party as you like')
  .action(async (name, file) => {
    const repository = await createRepository(repositoryDirectory);
    await exportJson(dialogue, repository)(name as string, file as string);
  });

program.parse(process.argv);

// export program;
