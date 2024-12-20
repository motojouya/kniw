import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import { createStore } from '@motojouya/kniw/src/store/party';
import { CopyFailError } from '@motojouya/kniw/src/io/repository';

export type ExportJson = (dialogue: Dialogue, repository: Repository) => (name: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, repository) => async (name, file) => {
  const store = await createStore(repository);

  const party = await store.get(name);
  if (
    party instanceof NotWearableErorr ||
    party instanceof DataNotFoundError ||
    party instanceof CharactorDuplicationError ||
    party instanceof JsonSchemaUnmatchError
  ) {
    await dialogue.notice(`${name}というpartyはありません`);
    return;
  }

  const result = await store.exportJson(party, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${name}を出力できませんでした`);
    return;
  }

  await dialogue.notice(`${name}を${file}に出力しました`);
};
