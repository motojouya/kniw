import type { Dialogue } from "../io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/ability/list";
import { show } from "../procedure/ability/show";

export const makeCommand = (dialogue: Dialogue) => {
  const ability = new Command("ability");

  ability
    .command("list")
    .description("show list of ability")
    .action(async () => list(dialogue));

  ability
    .command("show")
    .argument("<name>", "ability name you looking")
    .description("look ability as you like")
    .action(async (name) => show(dialogue)(name));

  return ability;
};
