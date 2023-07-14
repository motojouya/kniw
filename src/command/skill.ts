import type { Dialogue } from 'src/io/standard_dialogue';

import { Command } from '@commander-js/extra-typings';
import { list } from 'src/case/skill/list';
import { show } from 'src/case/skill/show';

export const makeCommand = (dialogue: Dialogue) => {
  const skill = new Command('skill');

  skill
    .command('list')
    .description('show list of skill')
    .action(async () => list(dialogue));

  skill
    .command('show')
    .argument('<name>', 'skill name you looking')
    .description('look skill as you like')
    .action(async name => show(dialogue)(name ));

  return skill;
};
