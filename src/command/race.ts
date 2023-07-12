import commander from 'commander';
import { list } from 'src/case/race/list';
import { show } from 'src/case/race/show';
import { dialogue } from 'src/io/standard_dialogue';

const program = new commander.Command();

export const race = program.command('race');

race
  .command('list')
  .description('show list of race')
  .action(async () => list(dialogue));

race
  .command('show')
  .argument('<name>', 'race name you looking')
  .description('look race as you like')
  .action(async name => show(dialogue)(name as string));

program.parse(process.argv);

// export program;
