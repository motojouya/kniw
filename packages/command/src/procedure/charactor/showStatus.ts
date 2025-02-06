import type { Dialogue } from "../../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { createRepository } from "@motojouya/kniw-core/store/charactor";
import { getPhysical, getAbilities, getSkills } from "@motojouya/kniw-core/model/charactor";
import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";

export type ShowStatus = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const showStatus: ShowStatus =
  ({ notice }, database) =>
  async (name) => {
    const repository = await createRepository(database);
    const characor = await repository.get(name);
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

    const abilities = getAbilities(characor);
    await notice("アビリティ:");
    await abilities.reduce((p, ability) => p.then(() => notice(`  - ${ability.label}`)), Promise.resolve());

    const skills = getSkills(characor);
    await notice("スキル:");
    await skills.reduce((p, skill) => p.then(() => notice(`  - ${skill.label}`)), Promise.resolve());
  };
