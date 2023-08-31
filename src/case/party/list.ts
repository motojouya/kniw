import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/repository';
import { createStore } from 'src/store/party';

export type List = (dialogue: Dialogue, repository: Repository) => Promise<void>;
export const list: List = async (dialogue, repository) => {
  const store = await createStore(repository);
  const partyList = await store.list();
  await partyList.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
};
