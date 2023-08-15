import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_STAB, MAGIC_TYPE_NONE } from 'src/domain/skill';

export const saturnRing: Skill = {
  name: 'saturnRing',
  label: '土星の輪',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  directType: DIRECT_TYPE_STAB,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 60,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '刺突の範囲攻撃',
};
