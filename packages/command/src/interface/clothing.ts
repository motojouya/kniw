import type { Dialogue } from "../io/standard_dialogue";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/clothing/list";
import { show } from "../procedure/clothing/show";

export const makeCommand = (dialogue: Dialogue) => {
  const clothing = new Command("clothing");

  clothing
    .command("list")
    .description("show list of clothing")
    .action(async () => list(dialogue));

  clothing
    .command("show")
    .argument("<name>", "clothing name you looking")
    .description("look clothing as you like")
    .action(async (name) => show(dialogue)(name));

  return clothing;
};
