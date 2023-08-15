import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WATER } from 'src/domain/skill';

export const flashFlood: Skill = {
  name: 'flashFlood',
  label: '鉄砲水',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WATER,
  baseDamage: 60,
  mpConsumption: 30,
  receiverCount: 5,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '水の範囲魔法',
};
