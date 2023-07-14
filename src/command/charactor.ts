import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';

import { Command } from '@commander-js/extra-typings';
import { list } from 'src/case/charactor/list';
import { showStatus } from 'src/case/charactor/showStatus';
import { fire } from 'src/case/charactor/fire';
import { hire } from 'src/case/charactor/hire';

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
