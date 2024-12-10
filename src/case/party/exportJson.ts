import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import { createStore } from '@motojouya/kniw/src/store/party';
import { CopyFailError } from '@motojouya/kniw/src/io/repository';

export type ExportJson = (dialogue: Dialogue, repository: Repository) => (name: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, repository) => async (name, file) => {
  const store = await createStore(repository);
  if (!store.exportJson) {
    const message = 'no copy function on party store!';
    console.debug(message);
    throw new Error(message);
  }
  const result = store.exportJson(name, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${name}を出力できませんでした`);
  }
  await dialogue.notice(`${name}を${file}に出力しました`);
};
