import type { Dialogue } from "../io/standard_dialogue";
import { blessingRepository } from "@motojouya/kniw-core/store/acquirement";

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async (name) => {
    const blessing = blessingRepository.get(name);
    if (!blessing) {
      await notice(`${name}というblessingは存在しません`);
      return;
    }
    await notice(`祝福: ${blessing.label}`);

    const physical = blessing.additionalPhysical;
    await notice("能力:");
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

    await notice("アビリティ:");
    await blessing.abilities.reduce((p, ability) => p.then(() => notice(`  - ${ability.label}`)), Promise.resolve());

    await notice("スキル:");
    await blessing.skills.reduce((p, skill) => p.then(() => notice(`  - ${skill.label}`)), Promise.resolve());

    await notice(`説明: ${blessing.description}`);
  };
