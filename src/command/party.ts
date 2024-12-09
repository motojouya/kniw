import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';

import { Command } from '@commander-js/extra-typings';
import { list } from '@motojouya/kniw/src/case/party/list';
import { showStatus } from '@motojouya/kniw/src/case/party/showStatus';
import { build } from '@motojouya/kniw/src/case/party/build';
import { change } from '@motojouya/kniw/src/case/party/change';
import { dismiss } from '@motojouya/kniw/src/case/party/dismiss';
import { exportJson } from '@motojouya/kniw/src/case/party/exportJson';

export const makeCommand = (dialogue: Dialogue, repository: Repository) => {
  const party = new Command('party');

  party
    .command('list')
    .description('list parties')
    .action(async () => list(dialogue, repository));

  party
    .command('build')
    .argument('<name>', 'building party name')
    .description('build a party as you like')
    .action(async name => build(dialogue, repository)(name));

  party
    .command('status')
    .argument('<name>', 'party name you looking')
    .description('look party as you like')
    .action(async name => showStatus(dialogue, repository)(name));

  party
    .command('change')
    .argument('<name>', 'changing party name')
    .description('change a party as you like')
    .action(async name => change(dialogue, repository)(name));

  party
    .command('dismiss')
    .argument('<name>', 'dismiss party name')
    .description('dismiss party as you like')
    .action(async name => dismiss(dialogue, repository)(name));

  party
    .command('export')
    .argument('<name>', 'export party name')
    .argument('<file>', 'export file')
    .description('export party as you like')
    .action(async (name, file) => exportJson(dialogue, repository)(name, file));

  return party;
};
