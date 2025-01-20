import type { Dialogue } from "@motojouya/kniw/src/io/standard_dialogue";
import type { Database } from "@motojouya/kniw/src/io/database";
import { createRepository } from "@motojouya/kniw/src/store/charactor";

export type List = (dialogue: Dialogue, database: Database) => Promise<void>;
export const list: List = async (dialogue, database) => {
  const repository = await createRepository(database);
  const characorList = await repository.list();
  await characorList.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
};
