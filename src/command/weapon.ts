import type { Dialogue } from 'src/io/standard_dialogue';

import { Command } from '@commander-js/extra-typings';
import { list } from 'src/case/weapon/list';
import { show } from 'src/case/weapon/show';

export const makeCommand = (dialogue: Dialogue) => {
  const weapon = new Command('weapon');

  weapon
    .command('list')
    .description('show list of weapon')
    .action(async () => list(dialogue));

  weapon
    .command('show')
    .argument('<name>', 'weapon name you looking')
    .description('look weapon as you like')
    .action(async name => show(dialogue)(name as string));

  return weapon;
};
