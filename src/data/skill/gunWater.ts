import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WATER } from 'src/domain/skill';

export const gunWater: Skill = {
  name: 'gunWater',
  label: '水鉄砲',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WATER,
  baseDamage: 30,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '水の基本魔法',
};
