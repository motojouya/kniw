import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy } from 'src/domain/skill';

export const stab: Skill = {
  name: 'stab',
  label: '突く',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '刺突の基本攻撃',
};
