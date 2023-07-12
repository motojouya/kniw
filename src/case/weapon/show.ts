import type { Dialogue } from 'src/io/standard_dialogue';
import { getWeapon } from 'src/store/acquirement';

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async name => {
    const weapon = getWeapon(name);
    if (!weapon) {
      await notice(`${name}というweaponは存在しません`);
      return;
    }
    await notice(`祝福: ${weapon.label}`);

    const physical = weapon.additionalPhysical;
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

    const abilities = weapon.abilities;
    await notice('アビリティ:');
    await abilities.reduce((p, ability) => p.then(() => notice(`  - ${ability.label}`)), Promise.resolve());

    const skills = weapon.skills;
    await notice('スキル:');
    await skills.reduce((p, skill) => p.then(() => notice(`  - ${skill.label}`)), Promise.resolve());

    await notice(`説明: ${weapon.description}`);
  };

