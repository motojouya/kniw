import type { Dialogue } from "../../io/standard_dialogue";
import { skillRepository } from "@motojouya/kniw-core/store/skill";

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async (name) => {
    const skill = skillRepository.get(name);
    if (!skill) {
      await notice(`${name}というskillは存在しません`);
      return;
    }
    await notice(`スキル名: ${skill.label}`);
    if (skill.type === "SKILL_TO_FIELD") {
      await notice(`効果対象: フィールド`);
    } else {
      await notice(`効果対象: キャラクター(最大${skill.receiverCount}体)`);
      await notice(`基本ダメージ: ${skill.baseDamage}`);
    }
    await notice(`加算WT: ${skill.additionalWt}`);
    await notice(`物理属性: ${skill.directType}`);
    await notice(`魔法属性: ${skill.magicType}`);
    await notice(`消費MP: ${skill.mpConsumption}`);
    await notice(`追加WT: ${skill.additionalWt}`);
    await notice(`効果距離: ${skill.effectLength}`);
    await notice(`説明: ${skill.description}`);
  };
