import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/repository';
import { createStore } from 'src/store/battle';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { CharactorDuplicationError } from 'src/domain/party';
import { NotBattlingError } from 'src/domain/battle';

export type ShowHistory = (dialogue: Dialogue, repository: Repository) => (title: string) => Promise<void>;
export const showHistory: ShowHistory =
  ({ notice }, repository) =>
  async title => {
    const store = await createStore(repository);
    const battle = await store.get(title);
    if (!battle) {
      await notice(`${title}という名前のタイトルは存在しません`);
      return;
    }
    if (
      battle instanceof NotWearableErorr ||
      battle instanceof DataNotFoundError ||
      battle instanceof CharactorDuplicationError ||
      battle instanceof JsonSchemaUnmatchError ||
      battle instanceof NotBattlingError
    ) {
      await notice(`${title}は不正なデータです。取り出せません。`);
      return;
    }

    await notice(`名前: ${battle.title}`);

    await notice(`home: ${battle.home.name}`);
    await battle.home.charactors.reduce(
      (p, charactor) =>
        p.then(async () => {
          await notice(`  - ${charactor.name}`);
          await notice(`    種族: ${charactor.race.label}`);
          await notice(`    祝福: ${charactor.blessing.label}`);
          await notice(`    装備: ${charactor.clothing.label}`);
          await notice(`    武器: ${charactor.weapon.label}`);
        }),
      Promise.resolve(),
    );

    await notice(`visitor: ${battle.visitor.name}`);
    await battle.visitor.charactors.reduce(
      (p, charactor) =>
        p.then(async () => {
          await notice(`  - ${charactor.name}`);
          await notice(`    種族: ${charactor.race.label}`);
          await notice(`    祝福: ${charactor.blessing.label}`);
          await notice(`    装備: ${charactor.clothing.label}`);
          await notice(`    武器: ${charactor.weapon.label}`);
        }),
      Promise.resolve(),
    );

    await notice(`ゲーム結果: ${battle.result}`);
  };
