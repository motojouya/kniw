import type { Skill } from '@motojouya/kniw/src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_ROCK } from '@motojouya/kniw/src/domain/skill';

export const gravelWall: Skill = {
  name: 'gravelWall',
  label: '礫の壁',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_ROCK,
  baseDamage: 90,
  mpConsumption: 30,
  receiverCount: 4,
  additionalWt: 150,
  effectLength: 1,
  getAccuracy: calcOrdinaryAccuracy,
  description: '打撃の範囲攻撃',
};
