import type { Skill } from '@motojouya/kniw/src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_FIRE } from '@motojouya/kniw/src/domain/skill';
import { fear } from '@motojouya/kniw/src/data/status/fear';

export const ghostFire: Skill = {
  name: 'ghostFire',
  label: '鬼火',
  type: 'SKILL_TO_CHARACTOR',
  action: (skill, actor, randoms, field, receiver) => addStatus(fear)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_FIRE,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '恐怖の付与',
};
