import { Field, Randoms } from 'src/model/basics'
import { Action } from 'src/model/action'
import { Charactor } from 'src/model/charactor'
import { skills } from 'src/data/skill'

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
  damage += Math.ceil(randoms.damage * 10) - 5);
  if (damage < 1) {
    return 1;
  } else {
    return damage;
  }
}

type CalcDirectAttack = (attacker: Character) => number;
const calcDirectAttack: CalcDirectAttack = attacker => (attacker.STR + attacker.DEX) / 2;

type CalcDirectDefence = (defencer: Character) => number;
const calcDirectDefence: CalcDirectDefence = defencer => (defencer.VIT + defencer.STR) / 2;

export const calcOrdinaryMagicalDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  let damage = calcMagicalAttack(actor) - calcMagicalDefence(receiver);
  damage += Math.ceil(randoms.damage * 10) - 5);
  if (damage < 1) {
    return 1;
  } else {
    return damage;
  }
}

type CalcMagicalAttack = (attacker: Character) => number;
const calcMagicalAttack: CalcMagicalAttack = attacker => (attacker.INT + attacker.MND) / 2;

type CalcMagicalDefence = (defencer: Character) => number;
const calcMagicalDefence: CalcMagicalDefence = defencer => (defencer.VIT + defencer.MND) / 2;

export const calcOrdinaryAccuracy: GetAccuracy = (self, actor, field, receiver) => (100 + calcAttackAccuracy(actor) - calcDefenceAccuracy(receiver)) / 100;

type CalcAttackAccuracy = (attacker: Character) => number;
const calcAttackAccuracy: CalcAttackAccuracy = attacker => (attacker.DEX + attacker.AGI) / 2;

type CalcDefenceAccuracy = (defencer: Character) => number;
const calcDefenceAccuracy: CalcDefenceAccuracy = defencer => (defencer.DEX + defencer.AVD) / 2;

