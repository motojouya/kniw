import type { Skill, ActionToCharactor } from '@motojouya/kniw/src/domain/skill';
import {
  calcOrdinaryDirectDamage,
  addStatus,
  calcOrdinaryAccuracy,
  DIRECT_TYPE_STAB,
  MAGIC_TYPE_NONE,
} from '@motojouya/kniw/src/domain/skill';
import { paralysis } from '@motojouya/kniw/src/data/status/paralysis';

export const paralysisAction: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  const newReceiver = calcOrdinaryDirectDamage(self, actor, randoms, field, receiver);
  return addStatus(paralysis)(self, actor, randoms, field, newReceiver);
};

export const paralysisShot: Skill = {
  name: 'paralysisShot',
  label: '神経の矢',
  type: 'SKILL_TO_CHARACTOR',
  action: paralysisAction,
  directType: DIRECT_TYPE_STAB,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 60,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '攻撃しつつ相手を麻痺にする',
};
