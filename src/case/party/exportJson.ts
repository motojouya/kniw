import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';
import { createRepository } from '@motojouya/kniw/src/store/party';
import { CopyFailError } from '@motojouya/kniw/src/io/database';
import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

export type ExportJson = (dialogue: Dialogue, database: Database) => (name: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, database) => async (name, file) => {
  const repository = await createRepository(database);

  const party = await repository.get(name);
  if (!party) {
    await dialogue.notice(`${name}というpartyはありません`);
    return;
  }
  if (
    party instanceof NotWearableErorr ||
    party instanceof DataNotFoundError ||
    party instanceof CharactorDuplicationError ||
    party instanceof JsonSchemaUnmatchError
  ) {
    await dialogue.notice(`${name}は不正なデータです`);
    return;
  }

  const result = await repository.exportJson(party, file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${name}を出力できませんでした`);
    return;
  }

  await dialogue.notice(`${name}を${file}に出力しました`);
};
