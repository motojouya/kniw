import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { createStore } from 'src/store/charactor';

export type List = (dialogue: Dialogue, repository: Repository) => Promise<void>;
export const list: List = async (dialogue, repository) => {
  const store = await createStore(repository);
  const characorList = await store.list();
  await characorList.reduce(
    (p, name) => p.then(() => dialogue.notice(`- ${name}`)),
    Promise.resolve()
  );
};
