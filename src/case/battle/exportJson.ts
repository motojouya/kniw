import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import { createStore } from '@motojouya/kniw/src/store/battle';
import { CopyFailError } from '@motojouya/kniw/src/io/repository';
import { toBattleJson } from '@motojouya/kniw/src/store/schema/battle';

export type ExportJson = (dialogue: Dialogue, repository: Repository) => (title: string, file: string) => Promise<void>;
export const exportJson: ExportJson = (dialogue, repository) => async (title, file) => {
  const store = await createStore(repository);

  const battle = await store.get(title);
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

  const result = await repository.exportJson(toBattleJson(battle), file);
  if (result instanceof CopyFailError) {
    await dialogue.notice(`${title}を出力できませんでした`);
    return;
  }

  await dialogue.notice(`${title}を${file}に出力しました`);
};
