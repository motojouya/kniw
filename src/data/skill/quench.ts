import type { Skill, ActionToCharactor } from 'src/domain/skill';
import { calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WATER } from 'src/domain/skill';
import { getPhysical } from 'src/domain/charactor';

export const recover: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  const physical = getPhysical(receiver);
  const newReceiver = {
    ...receiver,
  };
  newReceiver.hp += 150;
  if (newReceiver.hp > physical.MaxHP) {
    newReceiver.hp = physical.MaxHP;
  }
  return newReceiver;
};

export const quench: Skill = {
  name: 'quench',
  label: '恵みの雨',
  type: 'SKILL_TO_CHARACTOR',
  action: recover,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WATER,
  baseDamage: 150,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '回復',
};
