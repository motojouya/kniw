import commander from 'commander';
import { list } from 'src/case/charactor/list';
import { showStatus } from 'src/case/charactor/showStatus';
import { fire } from 'src/case/charactor/fire';
import { hire } from 'src/case/charactor/hire';
import { dialogue } from 'src/io/standard_dialogue';
import { createRepository, repositoryDirectory } from 'src/io/file_repository';

const program = new commander.Command();

const charactor = program.command('charactor');

charactor
  .command('list')
  .description('hire charactor as you like')
  .action(async () => {
    const repository = await createRepository(repositoryDirectory);
    await list(dialogue, repository);
  });

charactor
  .command('hire')
  .argument('<name>', 'hiring charactor name')
  .description('hire charactor as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await hire(dialogue, repository)(name as string);
  });

charactor
  .command('status')
  .argument('<name>', 'charactor name you looking')
  .description('look charactor as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await showStatus(dialogue, repository)(name as string);
  });

charactor
  .command('fire')
  .argument('<name>', 'firing charactor name')
  .description('fire charactor as you like')
  .action(async name => {
    const repository = await createRepository(repositoryDirectory);
    await fire(dialogue, repository)(name as string);
  });

program.parse(process.argv);

// export program;
