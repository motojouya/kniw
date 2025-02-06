import type { Dialogue } from "../io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/race/list";
import { show } from "../procedure/race/show";

export const makeCommand = (dialogue: Dialogue) => {
  const race = new Command("race");

  race
    .command("list")
    .description("show list of race")
    .action(async () => list(dialogue));

  race
    .command("show")
    .argument("<name>", "race name you looking")
    .description("look race as you like")
    .action(async (name) => show(dialogue)(name));

  return race;
};
