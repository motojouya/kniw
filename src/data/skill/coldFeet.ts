import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_NONE } from 'src/domain/skill';
import { avoidUp } from 'src/data/status/avoidUp';

export const coldFeet: Skill = {
  name: 'coldFeet',
  label: '逃げ腰',
  type: 'SKILL_TO_CHARACTOR',
  action: (skill, actor, randoms, field, receiver) => addStatus(avoidUp)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 0,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '対象の回避率をあげる',
};
