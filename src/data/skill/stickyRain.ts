import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WATER } from 'src/domain/skill';
import { directAttackDown } from 'src/data/status/directAttackDown';

export const stickyRain: Skill = {
  name: 'stickyRain',
  label: '酸性雨',
  type: 'SKILL_TO_CHARACTOR',
  action: (skill, actor, randoms, field, receiver) =>
    addStatus(directAttackDown)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WATER,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '物理攻撃down',
};
