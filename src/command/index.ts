import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';

// import commander from 'commander';
import { Command } from '@commander-js/extra-typings';

import { makeCommand as makeSkill } from 'src/command/skill';
import { makeCommand as makeAbility } from 'src/command/ability';
import { makeCommand as makeRace } from 'src/command/race';
import { makeCommand as makeBlessing } from 'src/command/blessing';
import { makeCommand as makeClothing } from 'src/command/clothing';
import { makeCommand as makeWeapon } from 'src/command/weapon';
import { makeCommand as makeCharactor } from 'src/command/charactor';
import { makeCommand as makeParty } from 'src/command/party';
import { makeCommand as makeBattle } from 'src/command/battle';

export const makeCommand = (dialogue: Dialogue, repository: Repository) => {
  const program = new Command();

  program.addCommand(makeSkill(dialogue));
  program.addCommand(makeAbility(dialogue));
  program.addCommand(makeRace(dialogue));
  program.addCommand(makeBlessing(dialogue));
  program.addCommand(makeClothing(dialogue));
  program.addCommand(makeWeapon(dialogue));
  program.addCommand(makeCharactor(dialogue, repository));
  program.addCommand(makeParty(dialogue, repository));
  program.addCommand(makeBattle(dialogue, repository));

  return program;
};
