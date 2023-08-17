import type { Skill, ActionToCharactor } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_SLASH, MAGIC_TYPE_NONE } from 'src/domain/skill';
import { paralysis } from 'src/data/status/paralysis';

export const paralysisAction: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  const newReceiver = calcOrdinaryDirectDamage(self, actor, randoms, field, receiver);
  if (!newReceiver.statuses.find(status => status.name === paralysis.name)) {
    newReceiver.statuses.push(paralysis);
  }
  return newReceiver;
};

export const paralysisScratch: Skill = {
  name: 'paralysisScratch',
  label: '神経の刃',
  type: 'SKILL_TO_CHARACTOR',
  action: paralysisAction,
  directType: DIRECT_TYPE_SLASH,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 60,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 1,
  getAccuracy: calcOrdinaryAccuracy,
  description: '攻撃しつつ相手を麻痺にする',
};
