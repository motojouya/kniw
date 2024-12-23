import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';
import { createRepository } from '@motojouya/kniw/src/store/battle';
import { CopyFailError } from '@motojouya/kniw/src/io/repository';

export type ExportJson = (dialogue: Dialogue, database: Database) => (title: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, database) => async (title, file) => {
  const repository = await createRepository(database);

  const battle = await repository.get(title);
  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError ||
    battle instanceof NotBattlingError
  ) {
    await dialogue.notice(`${title}というbattleはありません`);
    return;
  }

  const result = await repository.exportJson(battle, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${title}を出力できませんでした`);
    return;
  }

  await dialogue.notice(`${title}を${file}に出力しました`);
};
