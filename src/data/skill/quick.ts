import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WIND } from 'src/domain/skill';
import { quick as quickStatus } from 'src/data/status/quick';

export const quick: Skill = {
  name: 'quick',
  label: 'クイック',
  type: 'SKILL_TO_CHARACTOR',
  action: addStatus(quickStatus),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WIND,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: 'クイック状態の付与',
};
