import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WIND } from 'src/domain/skill';

export const tornade: Skill = {
  name: 'tornade',
  label: '大竜巻',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WIND,
  baseDamage: 100,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 150,
  getAccuracy: calcOrdinaryAccuracy,
  description: '風の強魔法',
};
