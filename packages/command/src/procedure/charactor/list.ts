import type { Dialogue } from "../../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { createRepository } from "@motojouya/kniw-core/store/charactor";

export type List = (dialogue: Dialogue, database: Database) => Promise<void>;
export const list: List = async (dialogue, database) => {
  const repository = await createRepository(database);
  const characorList = await repository.list();
  await characorList.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
};
