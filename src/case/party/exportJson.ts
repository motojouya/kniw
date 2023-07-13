import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { createStore } from 'src/store/party';
import { CopyFailError } from 'src/io/file_repository';

export type ExportJson = (dialogue: Dialogue, repository: Repository) => (name: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, repository) => async (name, file) => {
  const store = await createStore(repository);
  if (!store.copy) {
    const message = 'no copy function on party store!';
    console.debug(message);
    throw new Error(message);
  }
  const result = store.copy(name, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${name}を出力できませんでした`);
  }
  await dialogue.notice(`${name}を${file}に出力しました`);
};
