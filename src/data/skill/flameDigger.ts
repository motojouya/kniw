import type { Skill } from '@motojouya/kniw/src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_FIRE } from '@motojouya/kniw/src/domain/skill';
import { magicDiffenceDown } from '@motojouya/kniw/src/data/status/magicDiffenceDown';

export const flameDigger: Skill = {
  name: 'flameDigger',
  label: '炎で穿つ',
  type: 'SKILL_TO_CHARACTOR',
  action: (skill, actor, randoms, field, receiver) =>
    addStatus(magicDiffenceDown)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_FIRE,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '魔法防御down',
};
