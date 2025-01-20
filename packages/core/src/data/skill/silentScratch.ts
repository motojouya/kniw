import type { Skill, ActionToCharactor } from "@motojouya/kniw/src/domain/skill";
import {
  calcOrdinaryDirectDamage,
  addStatus,
  calcOrdinaryAccuracy,
  DIRECT_TYPE_SLASH,
  MAGIC_TYPE_NONE,
} from "@motojouya/kniw/src/domain/skill";
import { silent } from "@motojouya/kniw/src/data/status/silent";

export const silentAction: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  const newReceiver = calcOrdinaryDirectDamage(self, actor, randoms, field, receiver);
  return addStatus(silent)(self, actor, randoms, field, newReceiver);
};

export const silentScratch: Skill = {
  name: "silentScratch",
  label: "沈黙の刃",
  type: "SKILL_TO_CHARACTOR",
  action: silentAction,
  directType: DIRECT_TYPE_SLASH,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 60,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 1,
  getAccuracy: calcOrdinaryAccuracy,
  description: "攻撃しつつ相手を沈黙にする",
};
