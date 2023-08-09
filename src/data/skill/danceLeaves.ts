import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy } from 'src/domain/skill';

export const danceLeaves: Skill = {
  name: 'danceLeaves',
  label: '木の葉乱舞',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  receiverCount: 5,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '風の範囲魔法',
};
