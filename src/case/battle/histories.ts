import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import { createStore } from '@motojouya/kniw/src/store/battle';

export type Histories = (dialogue: Dialogue, repository: Repository) => Promise<void>;
export const histories: Histories = async (dialogue, repository) => {
  const store = await createStore(repository);
  const battleList = await store.list();
  await battleList.reduce((p, title) => p.then(() => dialogue.notice(`- ${title}`)), Promise.resolve());
};
