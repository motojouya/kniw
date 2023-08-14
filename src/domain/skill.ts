import { Field } from 'src/domain/field';
import { Randoms } from 'src/domain/random';
import { Charactor, getPhysical } from 'src/domain/charactor';

export type DirectType = 'SLASH' | 'STAB' | 'BLOW' | 'NONE';
export const DIRECT_TYPE_SLASH: DirectType = 'SLASH';
export const DIRECT_TYPE_STAB: DirectType = 'STAB';
export const DIRECT_TYPE_BLOW: DirectType = 'BLOW';
export const DIRECT_TYPE_NONE: DirectType = 'NONE';

export type MagicType = 'FIRE' | 'ROCK' | 'WATER' | 'ICE' | 'WIND' | 'THUNDER' | 'NONE';
export const MAGIC_TYPE_FIRE: MagicType = 'FIRE';
export const MAGIC_TYPE_ROCK: MagicType = 'ROCK';
export const MAGIC_TYPE_WATER: MagicType = 'WATER';
export const MAGIC_TYPE_ICE: MagicType = 'ICE';
export const MAGIC_TYPE_WIND: MagicType = 'WIND';
export const MAGIC_TYPE_THUNDER: MagicType = 'THUNDER';
export const MAGIC_TYPE_NONE: MagicType = 'NONE';

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
  directType: DirectType;
  magicType: MagicType;
  baseDamage: number;
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
  directType: DirectType;
  magicType: MagicType;
  receiverCount: 0;
  additionalWt: number;
  getAccuracy: GetAccuracy;
  description: string;
};

export type Skill = SkillToCharactor | SkillToField;

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

// StabResistance: 0,
// SlashResistance: 0,
// BlowResistance: 0,
// FireSuitable: 30,
// RockSuitable: 30,
// WaterSuitable: 0,
// IceSuitable: 0,
// AirSuitable: 0,
// ThunderSuitable: 0,

export const calcOrdinaryDirectDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  if (self.type === 'SKILL_TO_FIELD') {
    return receiver;
  }

  let damage = self.baseDamage + calcDirectAttack(self, actor) - calcDirectDefence(self, receiver);
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

type CalcMagicalAttack = (skill: Skill, attacker: Charactor) => number;
const calcMagicalAttack: CalcMagicalAttack = (skill, attacker) => {
  const physical = getPhysical(attacker);
  return (physical.INT + physical.MND) / 2;
};

type CalcMagicalDefence = (skill: Skill, defencer: Charactor) => number;
const calcMagicalDefence: CalcMagicalDefence = (skill, defencer) => {
  const physical = getPhysical(defencer);
  return (physical.VIT + physical.MND) / 2;
};

// TODO blessingに心、大地、海、空があり、空->海->大地->空という力関係なので、ダメージ計算にも反映させたい。心は力関係がない。
export const calcOrdinaryMagicalDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
  if (self.type === 'SKILL_TO_FIELD') {
    return receiver;
  }

  let damage = self.baseDamage + calcMagicalAttack(self, actor) - calcMagicalDefence(self, receiver);
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

type CalcAttackAccuracy = (skill: Skill, attacker: Charactor) => number;
const calcAttackAccuracy: CalcAttackAccuracy = (skill, attacker) => {
  const physical = getPhysical(attacker);
  return (physical.DEX + physical.AGI) / 2;
};

type CalcDefenceAccuracy = (skill: Skill, defencer: Charactor) => number;
const calcDefenceAccuracy: CalcDefenceAccuracy = (skill, defencer) => {
  const physical = getPhysical(defencer);
  return (physical.DEX + physical.AVD) / 2;
};

export const calcOrdinaryAccuracy: GetAccuracy = (self, actor, field, receiver) =>
  (100 + calcAttackAccuracy(actor) - calcDefenceAccuracy(receiver)) / 100;
