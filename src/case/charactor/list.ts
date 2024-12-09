import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import { createStore } from '@motojouya/kniw/src/store/charactor';

export type List = (dialogue: Dialogue, repository: Repository) => Promise<void>;
export const list: List = async (dialogue, repository) => {
  const store = await createStore(repository);
  const characorList = await store.list();
  await characorList.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
};
