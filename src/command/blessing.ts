import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';

import { Command } from '@commander-js/extra-typings';
import { list } from '@motojouya/kniw/src/case/blessing/list';
import { show } from '@motojouya/kniw/src/case/blessing/show';

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
    .action(async name => show(dialogue)(name));

  return blessing;
};
