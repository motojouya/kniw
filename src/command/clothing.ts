import commander from 'commander';
import { list } from 'src/case/clothing/list';
import { show } from 'src/case/clothing/show';
import { dialogue } from 'src/io/standard_dialogue';

const program = new commander.Command();

export const clothing = program.command('clothing');

clothing
  .command('list')
  .description('show list of clothing')
  .action(async () => list(dialogue));

clothing
  .command('show')
  .argument('<name>', 'clothing name you looking')
  .description('look clothing as you like')
  .action(async name => show(dialogue)(name as string));

program.parse(process.argv);

// export program;
