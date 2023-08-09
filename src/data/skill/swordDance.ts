import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy } from 'src/domain/skill';

export const swordDance: Skill = {
  name: 'swordDance',
  label: '剣の舞',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '斬撃の範囲攻撃',
};
