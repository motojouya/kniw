import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { raceRepository } from '@motojouya/kniw/src/store/acquirement';

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async name => {
    const race = raceRepository.get(name);
    if (!race) {
      await notice(`${name}というraceは存在しません`);
      return;
    }
    await notice(`祝福: ${race.label}`);

    const physical = race.additionalPhysical;
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
    await notice(`  刺突耐性: ${physical.StabResistance}`);
    await notice(`  斬撃耐性: ${physical.SlashResistance}`);
    await notice(`  打撃耐性: ${physical.BlowResistance}`);
    await notice(`  火属性: ${physical.FireSuitable}`);
    await notice(`  岩属性: ${physical.RockSuitable}`);
    await notice(`  水属性: ${physical.WaterSuitable}`);
    await notice(`  氷属性: ${physical.IceSuitable}`);
    await notice(`  風属性: ${physical.AirSuitable}`);
    await notice(`  雷属性: ${physical.ThunderSuitable}`);
    await notice(`  移動距離: ${physical.move}`);
    await notice(`  移動高さ: ${physical.jump}`);

    await notice('アビリティ:');
    await race.abilities.reduce((p, ability) => p.then(() => notice(`  - ${ability.label}`)), Promise.resolve());

    await notice('スキル:');
    await race.skills.reduce((p, skill) => p.then(() => notice(`  - ${skill.label}`)), Promise.resolve());

    await notice(`説明: ${race.description}`);
  };
