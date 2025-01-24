import type { Dialogue } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";

// import commander from 'commander';
import { Command } from "@commander-js/extra-typings";

import { makeCommand as makeSkill } from "./skill";
import { makeCommand as makeAbility } from "./ability";
import { makeCommand as makeRace } from "./race";
import { makeCommand as makeBlessing } from "./blessing";
import { makeCommand as makeClothing } from "./clothing";
import { makeCommand as makeWeapon } from "./weapon";
import { makeCommand as makeCharactor } from "./charactor";
import { makeCommand as makeParty } from "./party";
import { makeCommand as makeBattle } from "./battle";

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
