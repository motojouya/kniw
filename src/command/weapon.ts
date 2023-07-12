import commander from 'commander';
import { list } from 'src/case/weapon/list';
import { show } from 'src/case/weapon/show';
import { dialogue } from 'src/io/standard_dialogue';

const program = new commander.Command();

export const weapon = program.command('weapon');

weapon
  .command('list')
  .description('show list of weapon')
  .action(async () => list(dialogue));

weapon
  .command('show')
  .argument('<name>', 'weapon name you looking')
  .description('look weapon as you like')
  .action(async name => show(dialogue)(name as string));

program.parse(process.argv);

// export program;
