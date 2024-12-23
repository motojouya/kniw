import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';

import { Command } from '@commander-js/extra-typings';
import { histories } from '@motojouya/kniw/src/case/battle/histories';
import { showHistory } from '@motojouya/kniw/src/case/battle/showHistory';
import { start, resume } from '@motojouya/kniw/src/case/battle/battle';
import { exportJson } from '@motojouya/kniw/src/case/battle/exportJson';

export const makeCommand = (dialogue: Dialogue, database: Database) => {
  const battle = new Command('battle');

  battle
    .command('histories')
    .description('list histories')
    .action(async () => histories(dialogue, database));

  battle
    .command('history')
    .argument('<title>', 'party name you looking')
    .description('look party as you like')
    .action(async title => showHistory(dialogue, database)(title));

  battle
    .command('start')
    .argument('<title>', 'building party name')
    .argument('<home>', 'building party file path')
    .argument('<vistor>', 'building party file path')
    .description('build a party as you like')
    .action(async (title, home, visitor) => start(dialogue, database)(title, home, visitor));

  battle
    .command('resume')
    .argument('<title>', 'resume battle title')
    .description('resume battle')
    .action(async title => resume(dialogue, database)(title));

  battle
    .command('export')
    .argument('<title>', 'export battle history')
    .argument('<file>', 'export file')
    .description('export battle history')
    .action(async (title, file) => exportJson(dialogue, database)(title, file));

  return battle;
};
