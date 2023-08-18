import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_THUNDER } from 'src/domain/skill';
import { paralysis } from 'src/data/status/paralysis';

export const eleciWave: Skill = {
  name: 'eleciWave',
  label: '麻痺',
  type: 'SKILL_TO_CHARACTOR',
  action: addStatus(paralysis),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_THUNDER,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '麻痺の付与',
};
