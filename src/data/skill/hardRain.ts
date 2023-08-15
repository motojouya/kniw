import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_STAB, MAGIC_TYPE_NONE } from 'src/domain/skill';

export const hardRain: Skill = {
  name: 'hardRain',
  label: '堅い雨',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  directType: DIRECT_TYPE_STAB,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 150,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '弓矢の強攻撃',
};
