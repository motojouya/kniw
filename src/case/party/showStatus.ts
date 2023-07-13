import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { createStore } from 'src/store/party';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { CharactorDuplicationError } from 'src/domain/party';

export type ShowStatus = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const showStatus: ShowStatus =
  ({ notice }, repository) =>
  async name => {
    const store = await createStore(repository);
    const party = await store.get(name);
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
    await notice('メンバー:');
    await party.charactors.reduce(
      (p, charactor) => p.then(async () => {
        await notice(`  - ${charactor.name}`);
        await notice(`    種族: ${charactor.race.label}`);
        await notice(`    祝福: ${charactor.blessing.label}`);
        await notice(`    装備: ${charactor.clothing.label}`);
        await notice(`    武器: ${charactor.weapon.label}`);
      }),
      Promise.resolve()
    );
  };
