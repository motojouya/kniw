import type { Dialogue } from "../io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/weapon/list";
import { show } from "../procedure/weapon/show";

export const makeCommand = (dialogue: Dialogue) => {
  const weapon = new Command("weapon");

  weapon
    .command("list")
    .description("show list of weapon")
    .action(async () => list(dialogue));

  weapon
    .command("show")
    .argument("<name>", "weapon name you looking")
    .description("look weapon as you like")
    .action(async (name) => show(dialogue)(name));

  return weapon;
};
