import commander from 'commander';
import { list } from 'src/case/blessing/list';
import { show } from 'src/case/blessing/show';
import { dialogue } from 'src/io/standard_dialogue';

const program = new commander.Command();

export const blessing = program.command('blessing');

blessing
  .command('list')
  .description('show list of blessing')
  .action(async () => list(dialogue));

blessing
  .command('show')
  .argument('<name>', 'blessing name you looking')
  .description('look blessing as you like')
  .action(async name => show(dialogue)(name as string));

program.parse(process.argv);

// export program;
