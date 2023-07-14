import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { createStore } from 'src/store/battle';

export type Histories = (dialogue: Dialogue, repository: Repository) => Promise<void>;
export const histories: Histories = async (dialogue, repository) => {
  const store = await createStore(repository);
  const battleList = await store.list();
  await battleList.reduce((p, title) => p.then(() => dialogue.notice(`- ${title}`)), Promise.resolve());
};
