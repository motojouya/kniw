import type { Skill, ActionToCharactor } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_STAB, MAGIC_TYPE_NONE } from 'src/domain/skill';
import { silent } from 'src/data/status/silent';

export const silentAction: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  const newReceiver = calcOrdinaryDirectDamage(self, actor, randoms, field, receiver);
  if (!newReceiver.statuses.find(status => status.name === silent.name)) {
    newReceiver.statuses.push(silent);
  }
  return newReceiver;
};

export const silentShot: Skill = {
  name: 'silentShot',
  label: '沈黙の矢',
  type: 'SKILL_TO_CHARACTOR',
  action: silentAction,
  directType: DIRECT_TYPE_STAB,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 60,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '攻撃しつつ相手を沈黙にする',
};
