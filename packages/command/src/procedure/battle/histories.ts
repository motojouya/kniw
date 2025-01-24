import type { Dialogue } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { createRepository } from "@motojouya/kniw-core/store/battle";

export type Histories = (dialogue: Dialogue, database: Database) => Promise<void>;
export const histories: Histories = async (dialogue, database) => {
  const repository = await createRepository(database);
  const battleList = await repository.list();
  await battleList.reduce((p, title) => p.then(() => dialogue.notice(`- ${title}`)), Promise.resolve());
};
