import type { Dialogue } from "../io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/blessing/list";
import { show } from "../procedure/blessing/show";

export const makeCommand = (dialogue: Dialogue) => {
  const blessing = new Command("blessing");

  blessing
    .command("list")
    .description("show list of blessing")
    .action(async () => list(dialogue));

  blessing
    .command("show")
    .argument("<name>", "blessing name you looking")
    .description("look blessing as you like")
    .action(async (name) => show(dialogue)(name));

  return blessing;
};
