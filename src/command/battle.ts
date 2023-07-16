import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';

import { Command } from '@commander-js/extra-typings';
import { histories } from 'src/case/battle/histories';
import { showHistory } from 'src/case/battle/showHistory';
import { start, resume } from 'src/case/battle/battle';
import { exportJson } from 'src/case/battle/exportJson';

export const makeCommand = (dialogue: Dialogue, repository: Repository) => {
  const battle = new Command('battle');

  battle
    .command('histories')
    .description('list parties')
    .action(async () => histories(dialogue, repository));

  battle
    .command('history')
    .argument('<title>', 'party name you looking')
    .description('look party as you like')
    .action(async title => showHistory(dialogue, repository)(title));

  battle
    .command('start')
    .argument('<title>', 'building party name')
    .argument('<home>', 'building party name')
    .argument('<vistor>', 'building party name')
    .description('build a party as you like')
    .action(async (title, home, visitor) => start(dialogue, repository)(title as string, home as string, visitor as string));

  battle
    .command('resume')
    .argument('<title>', 'changing party name')
    .description('change a party as you like')
    .action(async title => resume(dialogue, repository)(title as string));

  battle
    .command('export')
    .argument('<title>', 'export party name')
    .argument('<file>', 'export file')
    .description('export party as you like')
    .action(async (title, file) => exportJson(dialogue, repository)(title, file));

  return battle;
};
