import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_FIRE } from 'src/domain/skill';

export const flameFall: Skill = {
  name: 'flameFall',
  label: 'Flame Fall',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_FIRE,
  baseDamage: 30,
  mpConsumption: 15,
  receiverCount: 5,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '基本魔法',
};
