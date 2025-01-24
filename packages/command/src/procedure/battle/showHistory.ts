import type { Dialogue } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { createRepository } from "@motojouya/kniw-core/store/battle";
import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";
import { CharactorDuplicationError } from "@motojouya/kniw-core/model/party";
import { NotBattlingError } from "@motojouya/kniw-core/model/battle";

export type ShowHistory = (dialogue: Dialogue, database: Database) => (title: string) => Promise<void>;
export const showHistory: ShowHistory =
  ({ notice }, database) =>
  async (title) => {
    const repository = await createRepository(database);
    const battle = await repository.get(title);
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
