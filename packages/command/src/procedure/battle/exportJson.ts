import type { Dialogue } from "../../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { createRepository } from "@motojouya/kniw-core/store/battle";
import { CopyFailError } from "@motojouya/kniw-core/io/database";
import { CharactorDuplicationError } from "@motojouya/kniw-core/model/party";
import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";

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
    battle instanceof JsonSchemaUnmatchError
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
