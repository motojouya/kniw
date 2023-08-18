import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WIND } from 'src/domain/skill';
import { sleep } from 'src/data/status/sleep';

export const heavyWind: Skill = {
  name: 'heavyWind',
  label: '春の暁',
  type: 'SKILL_TO_CHARACTOR',
  action: (skill, actor, randoms, field, receiver) => addStatus(sleep)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WIND,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '眠りの付与',
};
