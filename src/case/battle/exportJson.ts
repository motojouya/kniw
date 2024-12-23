import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';
import { createRepository } from '@motojouya/kniw/src/store/battle';
import { CopyFailError } from '@motojouya/kniw/src/io/database';
import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';


export type ExportJson = (dialogue: Dialogue, database: Database) => (title: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, database) => async (title, file) => {
  const repository = await createRepository(database);

  const battle = await repository.get(title);
  if (!battle) {
    await dialogue.notice(`${title}というbattleはありません`);
    return;
  }
  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError ||
    battle instanceof NotBattlingError
  ) {
    await dialogue.notice(`${title}のbattleは不正なデータです`);
    return;
  }

  const result = await repository.exportJson(battle, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${title}を出力できませんでした`);
    return;
  }

  await dialogue.notice(`${title}を${file}に出力しました`);
};
