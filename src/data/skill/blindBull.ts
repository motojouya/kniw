import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy } from 'src/domain/skill';

export const blindBull: Skill = {
  name: 'blindBull',
  label: '盲牛の突き',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '刺突における強攻撃',
};
