import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import { NotApplicable } from '@motojouya/kniw/src/io/standard_dialogue';
import { createStore } from '@motojouya/kniw/src/store/party';

export type Dismiss = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const dismiss: Dismiss = (dialogue, repository) => async name => {
  const store = await createStore(repository);
  const confirmAnswer = await dialogue.confirm(`本当に${name}を解散してもよろしいですか？`);
  if (!confirmAnswer || confirmAnswer instanceof NotApplicable) {
    return;
  }

  await store.remove(name);
  await dialogue.notice(`${name}を解散しました`);
};
