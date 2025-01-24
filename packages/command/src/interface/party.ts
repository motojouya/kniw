import type { Dialogue } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";

import { Command } from "@commander-js/extra-typings";
import { list } from "../procedure/party/list";
import { showStatus } from "../procedure/party/showStatus";
import { build } from "../procedure/party/build";
import { change } from "../procedure/party/change";
import { dismiss } from "../procedure/party/dismiss";
import { exportJson } from "../procedure/party/exportJson";

export const makeCommand = (dialogue: Dialogue, database: Database) => {
  const party = new Command("party");

  party
    .command("list")
    .description("list parties")
    .action(async () => list(dialogue, database));

  party
    .command("build")
    .argument("<name>", "building party name")
    .description("build a party as you like")
    .action(async (name) => build(dialogue, database)(name));

  party
    .command("status")
    .argument("<name>", "party name you looking")
    .description("look party as you like")
    .action(async (name) => showStatus(dialogue, database)(name));

  party
    .command("change")
    .argument("<name>", "changing party name")
    .description("change a party as you like")
    .action(async (name) => change(dialogue, database)(name));

  party
    .command("dismiss")
    .argument("<name>", "dismiss party name")
    .description("dismiss party as you like")
    .action(async (name) => dismiss(dialogue, database)(name));

  party
    .command("export")
    .argument("<name>", "export party name")
    .argument("<file>", "export file")
    .description("export party as you like")
    .action(async (name, file) => exportJson(dialogue, database)(name, file));

  return party;
};
