import type { Dialogue } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/charactor/list";
import { showStatus } from "../procedure/charactor/showStatus";
import { fire } from "../procedure/charactor/fire";
import { hire } from "../procedure/charactor/hire";

export const makeCommand = (dialogue: Dialogue, database: Database) => {
  const charactor = new Command("charactor");

  charactor
    .command("list")
    .description("hire charactor as you like")
    .action(async () => list(dialogue, database));

  charactor
    .command("hire")
    .argument("<name>", "hiring charactor name")
    .description("hire charactor as you like")
    .action(async (name) => hire(dialogue, database)(name));

  charactor
    .command("status")
    .argument("<name>", "charactor name you looking")
    .description("look charactor as you like")
    .action(async (name) => showStatus(dialogue, database)(name));

  charactor
    .command("fire")
    .argument("<name>", "firing charactor name")
    .description("fire charactor as you like")
    .action(async (name) => fire(dialogue, database)(name));

  return charactor;
};
