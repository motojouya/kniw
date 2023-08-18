import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_NONE } from 'src/domain/skill';
import { accuracyUp } from 'src/data/status/accuracyUp';

export const concentration: Skill = {
  name: 'concentration',
  label: '精神集中',
  type: 'SKILL_TO_CHARACTOR',
  action: (skill, actor, randoms, field, receiver) => addStatus(accuracyUp)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 0,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '対象の攻撃命中率をあげる',
};
