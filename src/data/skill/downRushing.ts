import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WATER } from 'src/domain/skill';

export const downRushing: Skill = {
  name: 'downRushing',
  label: '落下する滝',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WATER,
  baseDamage: 100,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 150,
  getAccuracy: calcOrdinaryAccuracy,
  description: '水の強魔法',
};
