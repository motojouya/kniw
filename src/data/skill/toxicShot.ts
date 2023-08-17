import type { Skill, ActionToCharactor } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_STAB, MAGIC_TYPE_NONE } from 'src/domain/skill';
import { acid } from 'src/data/status/acid';

export const toxicAction: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  const newReceiver = calcOrdinaryDirectDamage(self, actor, randoms, field, receiver);
  if (!newReceiver.statuses.find(status => status.name === acid.name)) {
    newReceiver.statuses.push(acid);
  }
  return newReceiver;
};

export const toxicShot: Skill = {
  name: 'toxicShot',
  label: '毒の矢',
  type: 'SKILL_TO_CHARACTOR',
  action: toxicAction,
  directType: DIRECT_TYPE_STAB,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 60,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '攻撃しつつ相手を毒にする',
};
