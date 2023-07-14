import type { Dialogue } from 'src/io/standard_dialogue';

import { Command } from '@commander-js/extra-typings';
import { list } from 'src/case/blessing/list';
import { show } from 'src/case/blessing/show';

export const makeCommand = (dialogue: Dialogue) => {
  const blessing = new Command('blessing');

  blessing
    .command('list')
    .description('show list of blessing')
    .action(async () => list(dialogue));

  blessing
    .command('show')
    .argument('<name>', 'blessing name you looking')
    .description('look blessing as you like')
    .action(async name => show(dialogue)(name as string));

  return blessing;
}
