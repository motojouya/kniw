import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_ROCK } from 'src/domain/skill';
import { directDiffenceUp } from 'src/data/status/directDiffenceUp';

export const stoneShell: Skill = {
  name: 'stoneShell',
  label: '亀甲岩',
  type: 'SKILL_TO_CHARACTOR',
  action: addStatus(directDiffenceUp),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_ROCK,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '物理防御up',
};
