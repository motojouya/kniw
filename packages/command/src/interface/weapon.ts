import type { Dialogue } from "@motojouya/kniw/src/io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "@motojouya/kniw/src/case/weapon/list";
import { show } from "@motojouya/kniw/src/case/weapon/show";

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
