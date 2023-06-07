import { Field, Randoms } from 'src/model/basics'
import { Action } from 'src/model/action'
import { Charactor, getPhysical } from 'src/model/charactor'
import * as skills from 'src/data/skill'

export type ActionToCharactor = (self: Skill) => (actor: Charactor) => (randoms: Randoms) => (field: Field) => (receiver: Charactor) => Charactor;
export type ActionToField = (self: Skill) => (actor: Charactor) => (randoms: Randoms) => (field: Field) => Field;
export type GetAccuracy = (self: Skill) => (actor: Charactor) => (field: Field) => (receiver: Charactor) => number;

export type Skill = {
  name: string,
  action: ActionToCharactor,
  receiverCount: number,
  additionalWt: number,
  getAccuracy: GetAccuracy,
  description: string,
} | {
  name: string,
  action: ActionToField,
  receiverCount: 0,
  additionalWt: number,
  getAccuracy: GetAccuracy,
  description: string,
};

//dryrun関数の中では、ramdomsが固定でactionTimesが>1でも1回のみ実行
//actionTimesが0の場合はfieldに影響を及ぼすタイプのやつ

export type CreateSkill = (name: string) => Skill;
export const createSkill: CreateSkill = name => skills.find(skill => name === skill.name);

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
}

type CalcDirectAttack = (attacker: Character) => number;
const calcDirectAttack: CalcDirectAttack = attacker => {
  const physical = getPhysical(attacker);
  return (physical.STR + physical.DEX) / 2;
};
(attacker.STR + attacker.DEX) / 2;

type CalcDirectDefence = (defencer: Character) => number;
const calcDirectDefence: CalcDirectDefence = defencer => {
  const physical = getPhysical(defencer);
  return (physical.VIT + physical.STR) / 2;
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
}

type CalcMagicalAttack = (attacker: Character) => number;
const calcMagicalAttack: CalcMagicalAttack = attacker => {
  const physical = getPhysical(attacker);
  return (physical.INT + physical.MND) / 2;
};

type CalcMagicalDefence = (defencer: Character) => number;
const calcMagicalDefence: CalcMagicalDefence = defencer => {
  const physical = getPhysical(defencer);
  return (physical.VIT + physical.MND) / 2;
};

export const calcOrdinaryAccuracy: GetAccuracy = (self, actor, field, receiver) => (100 + calcAttackAccuracy(actor) - calcDefenceAccuracy(receiver)) / 100;

type CalcAttackAccuracy = (attacker: Character) => number;
const calcAttackAccuracy: CalcAttackAccuracy = attacker => {
  const physical = getPhysical(attacker);
  return (physical.DEX + physical.AGI) / 2;
};

type CalcDefenceAccuracy = (defencer: Character) => number;
const calcDefenceAccuracy: CalcDefenceAccuracy = defencer => {
  const physical = getPhysical(defencer);
  return (physical.DEX + physical.AVD) / 2;
};

