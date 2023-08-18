import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_ICE } from 'src/domain/skill';
import { slow as slowStatus } from 'src/data/status/slow';

export const slow: Skill = {
  name: 'slow',
  label: 'スロウ',
  type: 'SKILL_TO_CHARACTOR',
  action: addStatus(slowStatus),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_ICE,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: 'スロウ付与',
};
