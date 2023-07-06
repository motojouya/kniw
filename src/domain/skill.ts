import { Field } from 'src/domain/field';
import { Randoms } from 'src/domain/random';
import { Charactor, getPhysical } from 'src/domain/charactor';

export type ActionToCharactor = (
  self: Skill,
  actor: Charactor,
  randoms: Randoms,
  field: Field,
  receiver: Charactor,
) => Charactor;
export type ActionToField = (self: Skill, actor: Charactor, randoms: Randoms, field: Field) => Field;
export type GetAccuracy = (self: Skill, actor: Charactor, field: Field, receiver: Charactor) => number;

export type SkillToCharactor = {
  name: string;
  label: string;
  type: 'SKILL_TO_CHARACTOR';
  action: ActionToCharactor;
  receiverCount: number;
  additionalWt: number;
  getAccuracy: GetAccuracy;
  description: string;
};

export type SkillToField = {
  name: string;
  label: string;
  type: 'SKILL_TO_FIELD';
  action: ActionToField;
  receiverCount: 0;
  additionalWt: number;
  getAccuracy: GetAccuracy;
  description: string;
};

export type Skill = SkillToCharactor | SkillToField;

// dryrun関数の中では、ramdomsが固定でactionTimesが>1でも1回のみ実行
// actionTimesが0の場合はfieldに影響を及ぼすタイプのやつ

type CalcDirectAttack = (attacker: Charactor) => number;
const calcDirectAttack: CalcDirectAttack = attacker => {
  const physical = getPhysical(attacker);
  return (physical.STR + physical.DEX) / 2;
};

type CalcDirectDefence = (defencer: Charactor) => number;
const calcDirectDefence: CalcDirectDefence = defencer => {
  const physical = getPhysical(defencer);
  return (physical.VIT + physical.STR) / 2;
};

export const calcOrdinaryDirectDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  let damage = calcDirectAttack(actor) - calcDirectDefence(receiver);
  damage += Math.ceil(randoms.damage * 10) - 5;
  if (damage < 1) {
    damage = 1;
  }

  let restHp = receiver.hp - damage;
  if (restHp < 0) {
    restHp = 0;
  }

  return {
    ...receiver,
    hp: restHp,
  };
};

type CalcMagicalAttack = (attacker: Charactor) => number;
const calcMagicalAttack: CalcMagicalAttack = attacker => {
  const physical = getPhysical(attacker);
  return (physical.INT + physical.MND) / 2;
};

type CalcMagicalDefence = (defencer: Charactor) => number;
const calcMagicalDefence: CalcMagicalDefence = defencer => {
  const physical = getPhysical(defencer);
  return (physical.VIT + physical.MND) / 2;
};

export const calcOrdinaryMagicalDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  let damage = calcMagicalAttack(actor) - calcMagicalDefence(receiver);
  damage += Math.ceil(randoms.damage * 10) - 5;
  if (damage < 1) {
    damage = 1;
  }

  let restHp = receiver.hp - damage;
  if (restHp < 0) {
    restHp = 0;
  }

  return {
    ...receiver,
    hp: restHp,
  };
};

type CalcAttackAccuracy = (attacker: Charactor) => number;
const calcAttackAccuracy: CalcAttackAccuracy = attacker => {
  const physical = getPhysical(attacker);
  return (physical.DEX + physical.AGI) / 2;
};

type CalcDefenceAccuracy = (defencer: Charactor) => number;
const calcDefenceAccuracy: CalcDefenceAccuracy = defencer => {
  const physical = getPhysical(defencer);
  return (physical.DEX + physical.AVD) / 2;
};

export const calcOrdinaryAccuracy: GetAccuracy = (self, actor, field, receiver) =>
  (100 + calcAttackAccuracy(actor) - calcDefenceAccuracy(receiver)) / 100;
