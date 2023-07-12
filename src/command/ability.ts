import commander from 'commander';
import { list } from 'src/case/ability/list';
import { show } from 'src/case/ability/show';
import { dialogue } from 'src/io/standard_dialogue';

const program = new commander.Command();

export const ability = program.command('ability');

ability
  .command('list')
  .description('show list of ability')
  .action(async () => list(dialogue));

ability
  .command('show')
  .argument('<name>', 'ability name you looking')
  .description('look ability as you like')
  .action(async name => show(dialogue)(name as string));

program.parse(process.argv);

// export program;
