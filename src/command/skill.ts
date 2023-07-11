import commander from 'commander';
import { list } from 'src/case/skill/list';
import { show } from 'src/case/skill/show';
import { notice } from 'src/io/standard_dialogue';

const program = new commander.Command();

export const skill = program.command('skill');

skill
  .command('list')
  .description('show list of skill')
  .action(async () => list(notice));

skill
  .command('show')
  .argument('<name>', 'skill name you looking')
  .description('look skill as you like')
  .action(async name => show(notice)(name));

program.parse(process.argv);

// export program;
