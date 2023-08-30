import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { createStore } from 'src/store/battle';
import { CopyFailError } from 'src/io/file_repository';

export type ExportJson = (dialogue: Dialogue, repository: Repository) => (title: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, repository) => async (title, file) => {
  const store = await createStore(repository);
  if (!store.copy) {
    const message = 'no copy function on party store!';
    console.debug(message);
    throw new Error(message);
  }
  const result = store.exportJson(title, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${title}を出力できませんでした`);
  }
  await dialogue.notice(`${title}を${file}に出力しました`);
};
