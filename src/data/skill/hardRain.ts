import type { Skill } from '@motojouya/kniw/src/domain/skill';
import { calcOrdinaryAccuracy, DIRECT_TYPE_STAB, MAGIC_TYPE_NONE } from '@motojouya/kniw/src/domain/skill';
import { shotAction } from '@motojouya/kniw/src/data/skill/shot';

export const hardRain: Skill = {
  name: 'hardRain',
  label: '堅い雨',
  type: 'SKILL_TO_CHARACTOR',
  action: shotAction,
  directType: DIRECT_TYPE_STAB,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 150,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 150,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '弓矢の強攻撃',
};
