import type { Dialogue } from 'src/io/standard_dialogue';

import { Command } from '@commander-js/extra-typings';
import { list } from 'src/case/race/list';
import { show } from 'src/case/race/show';

export const makeCommand = (dialogue: Dialogue) => {
  const race = new Command('race');

  race
    .command('list')
    .description('show list of race')
    .action(async () => list(dialogue));

  race
    .command('show')
    .argument('<name>', 'race name you looking')
    .description('look race as you like')
    .action(async name => show(dialogue)(name ));

  return race;
};
