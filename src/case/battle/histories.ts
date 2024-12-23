import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';
import { createRepository } from '@motojouya/kniw/src/store/battle';

export type Histories = (dialogue: Dialogue, database: Database) => Promise<void>;
export const histories: Histories = async (dialogue, database) => {
  const repository = await createRepository(database);
  const battleList = await repository.list();
  await battleList.reduce((p, title) => p.then(() => dialogue.notice(`- ${title}`)), Promise.resolve());
};
