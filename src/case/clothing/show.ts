import type { Dialogue } from 'src/io/standard_dialogue';
import { getClothing } from 'src/store/acquirement';

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async name => {
    const clothing = getClothing(name);
    if (!clothing) {
      await notice(`${name}というclothingは存在しません`);
      return;
    }
    await notice(`装備: ${clothing.label}`);

    const physical = clothing.additionalPhysical;
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

    const abilities = clothing.abilities;
    await notice('アビリティ:');
    await abilities.reduce((p, ability) => p.then(() => notice(`  - ${ability.label}`)), Promise.resolve());

    const skills = clothing.skills;
    await notice('スキル:');
    await skills.reduce((p, skill) => p.then(() => notice(`  - ${skill.label}`)), Promise.resolve());

    await notice(`説明: ${clothing.description}`);
  };

