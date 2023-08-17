import type { Skill } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_ICE } from 'src/domain/skill';

export const cumulonimbus: Skill = {
  name: 'cumulonimbus',
  label: '雨乞い',
  type: 'SKILL_TO_FIELD',
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_ICE,
  mpConsumption: 15,
  receiverCount: 0,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '天候を雨に',
};
