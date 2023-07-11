import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { createStore } from 'src/store/charactor';
import { getPhysical, getAbilities, getSkills } from 'src/domain/charactor';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

export type ShowStatus = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const showStatus: ShowStatus =
  ({ notice }, repository) =>
  async name => {
    const store = await createStore(repository);
    const characor = await store.get(name);
    if (!characor) {
      await notice(`${name}というcharactorは存在しません`);
      return;
    }
    if (
      characor instanceof NotWearableErorr ||
      characor instanceof DataNotFoundError ||
      characor instanceof JsonSchemaUnmatchError
    ) {
      await notice(`${name}は不正なデータです。取り出せません。`);
      return;
    }

    await notice(`名前: ${characor.name}`);
    await notice(`種族: ${characor.race.label}`);
    await notice(`祝福: ${characor.blessing.label}`);
    await notice(`装備: ${characor.clothing.label}`);
    await notice(`武器: ${characor.weapon.label}`);

    const physical = getPhysical(characor);
    await notice('能力:');
    await notice(`  MaxHP: ${physical.MaxHP}`);
    await notice(`  MaxMP: ${physical.MaxMP}`);
    await notice(`  STR: ${physical.STR}`);
    await notice(`  VIT: ${physical.VIT}`);
    await notice(`  DEX: ${physical.DEX}`);
    await notice(`  AGI: ${physical.AGI}`);
    await notice(`  AVD: ${physical.AVD}`);
    await notice(`  INT: ${physical.INT}`);
    await notice(`  MND: ${physical.MND}`);
    await notice(`  RES: ${physical.RES}`);
    await notice(`  WT: ${physical.WT}`);

    const abilities = getAbilities(characor);
    await notice('アビリティ:');
    abilities.forEach(async ability => notice(`  - ${ability.label}`));

    const skills = getSkills(characor);
    await notice('スキル:');
    skills.forEach(async skill => notice(`  - ${skill.label}`));
  };
