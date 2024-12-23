import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';
import { NotApplicable } from '@motojouya/kniw/src/io/standard_dialogue';
import { createRepository } from '@motojouya/kniw/src/store/party';

export type Dismiss = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const dismiss: Dismiss = (dialogue, database) => async name => {
  const repository = await createRepository(database);
  const confirmAnswer = await dialogue.confirm(`本当に${name}を解散してもよろしいですか？`);
  if (!confirmAnswer || confirmAnswer instanceof NotApplicable) {
    return;
  }

  await repository.remove(name);
  await dialogue.notice(`${name}を解散しました`);
};
