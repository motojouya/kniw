import type { Dialogue } from "@motojouya/kniw/src/io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "@motojouya/kniw/src/case/ability/list";
import { show } from "@motojouya/kniw/src/case/ability/show";

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
