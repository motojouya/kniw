import type { Dialogue } from 'src/io/standard_dialogue';
import { getSkill } from 'src/store/skill';

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show = ({ notice }) => async name => {
  const skill = getSkill(name);
  if (!skill) {
    await notice(`${name}というskillは存在しません`);
    return;
  }
  await notice(`スキル名: ${skill.label}`);
  if (skill.type === 'SKILL_TO_CHARACTOR') {
    await notice(`効果対象: キャラクター(最大${skill.receiverCount}体)`);
  } else {
    await notice(`効果対象: フィールド`);
  }
  await notice(`加算WT: ${skill.additionalWt}`);
  await notice(`説明: ${skill.description}`);
};

