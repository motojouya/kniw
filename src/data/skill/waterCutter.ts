import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WATER } from 'src/domain/skill';

export const waterCutter: Skill = {
  name: 'waterCutter',
  label: '水刃の鎖',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WATER,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 5,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '物理攻撃up',
};
