import type { Dialogue } from "@motojouya/kniw/src/io/standard_dialogue";
import type { Database } from "@motojouya/kniw/src/io/database";
import { createRepository } from "@motojouya/kniw/src/store/party";
import { NotWearableErorr } from "@motojouya/kniw/src/domain/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "@motojouya/kniw/src/store/schema/schema";
import { CharactorDuplicationError } from "@motojouya/kniw/src/domain/party";

export type ShowStatus = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const showStatus: ShowStatus =
  ({ notice }, database) =>
  async (name) => {
    const repository = await createRepository(database);
    const party = await repository.get(name);
    if (!party) {
      await notice(`${name}というpartyは存在しません`);
      return;
    }
    if (
      party instanceof NotWearableErorr ||
      party instanceof DataNotFoundError ||
      party instanceof CharactorDuplicationError ||
      party instanceof JsonSchemaUnmatchError
    ) {
      await notice(`${name}は不正なデータです。取り出せません。`);
      return;
    }

    await notice(`名前: ${party.name}`);
    await notice("メンバー:");
    await party.charactors.reduce(
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
  };
