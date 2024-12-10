import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';

import { Command } from '@commander-js/extra-typings';
import { list } from '@motojouya/kniw/src/case/charactor/list';
import { showStatus } from '@motojouya/kniw/src/case/charactor/showStatus';
import { fire } from '@motojouya/kniw/src/case/charactor/fire';
import { hire } from '@motojouya/kniw/src/case/charactor/hire';

export const makeCommand = (dialogue: Dialogue, repository: Repository) => {
  const charactor = new Command('charactor');

  charactor
    .command('list')
    .description('hire charactor as you like')
    .action(async () => list(dialogue, repository));

  charactor
    .command('hire')
    .argument('<name>', 'hiring charactor name')
    .description('hire charactor as you like')
    .action(async name => hire(dialogue, repository)(name));

  charactor
    .command('status')
    .argument('<name>', 'charactor name you looking')
    .description('look charactor as you like')
    .action(async name => showStatus(dialogue, repository)(name));

  charactor
    .command('fire')
    .argument('<name>', 'firing charactor name')
    .description('fire charactor as you like')
    .action(async name => fire(dialogue, repository)(name));

  return charactor;
};
