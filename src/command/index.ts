import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';

// import commander from 'commander';
import { Command } from '@commander-js/extra-typings';

import { makeCommand as makeSkill } from '@motojouya/kniw/src/command/skill';
import { makeCommand as makeAbility } from '@motojouya/kniw/src/command/ability';
import { makeCommand as makeRace } from '@motojouya/kniw/src/command/race';
import { makeCommand as makeBlessing } from '@motojouya/kniw/src/command/blessing';
import { makeCommand as makeClothing } from '@motojouya/kniw/src/command/clothing';
import { makeCommand as makeWeapon } from '@motojouya/kniw/src/command/weapon';
import { makeCommand as makeCharactor } from '@motojouya/kniw/src/command/charactor';
import { makeCommand as makeParty } from '@motojouya/kniw/src/command/party';
import { makeCommand as makeBattle } from '@motojouya/kniw/src/command/battle';

export const makeCommand = (dialogue: Dialogue, database: Database) => {
  const program = new Command();

  program.addCommand(makeSkill(dialogue));
  program.addCommand(makeAbility(dialogue));
  program.addCommand(makeRace(dialogue));
  program.addCommand(makeBlessing(dialogue));
  program.addCommand(makeClothing(dialogue));
  program.addCommand(makeWeapon(dialogue));
  program.addCommand(makeCharactor(dialogue, database));
  program.addCommand(makeParty(dialogue, database));
  program.addCommand(makeBattle(dialogue, database));

  return program;
};
