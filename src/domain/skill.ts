import { Field } from 'src/domain/field';
import { Randoms } from 'src/domain/random';
import { Charactor, getPhysical } from 'src/domain/charactor';
import {
  directAttackUp,
  directAttackDown,
  directDiffenceUp,
  directDiffenceDown,
  magicAttackUp,
  magicAttackDown,
  magicDiffenceUp,
  magicDiffenceDown,
} from 'src/data/status';

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
  mpConsumption: number;
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
  mpConsumption: number;
  receiverCount: 0;
  additionalWt: number;
  getAccuracy: GetAccuracy;
  description: string;
};

export type Skill = SkillToCharactor | SkillToField;

type CalcMagicRate = (skill: Skill, charactor: Charactor) => number;
const calcMagicRate: CalcMagicRate = (skill, charactor) => {
  const physical = getPhysical(charactor);
  switch (skill.magicType) {
    case MAGIC_TYPE_FIRE:
      return 100 + physical.FireSuitable;
    case MAGIC_TYPE_ROCK:
      return 100 + physical.RockSuitable;
    case MAGIC_TYPE_WATER:
      return 100 + physical.WaterSuitable;
    case MAGIC_TYPE_ICE:
      return 100 + physical.IceSuitable;
    case MAGIC_TYPE_WIND:
      return 100 + physical.AirSuitable;
    case MAGIC_TYPE_THUNDER:
      return 100 + physical.ThunderSuitable;
    default:
      return 100;
  }
};

type CalcMagicRegistance = (skill: Skill, charactor: Charactor) => number;
const calcMagicRegistance: CalcMagicRegistance = (skill, charactor) => {
  const physical = getPhysical(charactor);
  switch (skill.magicType) {
    case MAGIC_TYPE_FIRE:
    case MAGIC_TYPE_ROCK:
      return 100 + physical.WaterSuitable + physical.IceSuitable - physical.AirSuitable - physical.ThunderSuitable;
    case MAGIC_TYPE_WATER:
    case MAGIC_TYPE_ICE:
      return 100 + physical.AirSuitable + physical.ThunderSuitable - physical.FireSuitable - physical.RockSuitable;
    case MAGIC_TYPE_WIND:
    case MAGIC_TYPE_THUNDER:
      return 100 + physical.FireSuitable + physical.RockSuitable - physical.WaterSuitable - physical.IceSuitable;
    default:
      return 100;
  }
};

type CalcDirectRegistance = (skill: Skill, charactor: Charactor) => number;
const calcDirectRegistance: CalcDirectRegistance = (skill, charactor) => {
  const physical = getPhysical(charactor);
  switch (skill.directType) {
    case DIRECT_TYPE_SLASH:
      return 100 + physical.SlashResistance;
    case DIRECT_TYPE_BLOW:
      return 100 + physical.BlowResistance;
    case DIRECT_TYPE_STAB:
      return 100 + physical.StabResistance;
    default:
      return 100;
  }
};

type CalcDirectAttack = (skill: Skill, attacker: Charactor) => number;
const calcDirectAttack: CalcDirectAttack = (skill, attacker) => {
  const physical = getPhysical(attacker);
  const magicRate = calcMagicRate(skill, attacker);

  const upRate = attacker.statuses.find(status => status.name === directAttackUp.name) ? 1.2 : 1;
  const downRate = attacker.statuses.find(status => status.name === directAttackDown.name) ? 0.8 : 1;

  return ((physical.STR + physical.DEX) * magicRate * upRate * downRate) / 100;
};

type CalcDirectDefence = (skill: Skill, defencer: Charactor) => number;
const calcDirectDefence: CalcDirectDefence = (skill, defencer) => {
  const physical = getPhysical(defencer);
  const magicRegistance = calcMagicRegistance(skill, defencer);
  const directRegistance = calcDirectRegistance(skill, defencer);

  const upRate = defencer.statuses.find(status => status.name === directDiffenceUp.name) ? 1.2 : 1;
  const downRate = defencer.statuses.find(status => status.name === directDiffenceDown.name) ? 0.8 : 1;

  return ((physical.VIT + physical.STR) * directRegistance * magicRegistance * upRate * downRate) / 100 / 100;
};

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
  const magicRate = calcMagicRate(skill, attacker);

  const upRate = attacker.statuses.find(status => status.name === magicAttackUp.name) ? 1.2 : 1;
  const downRate = attacker.statuses.find(status => status.name === magicAttackDown.name) ? 0.8 : 1;

  return ((physical.INT + physical.MND) * magicRate * upRate * downRate) / 100;
};

type CalcMagicalDefence = (skill: Skill, defencer: Charactor) => number;
const calcMagicalDefence: CalcMagicalDefence = (skill, defencer) => {
  const physical = getPhysical(defencer);
  const magicRegistance = calcMagicRegistance(skill, defencer);
  const directRegistance = calcDirectRegistance(skill, defencer);

  const upRate = defencer.statuses.find(status => status.name === magicDiffenceUp.name) ? 1.2 : 1;
  const downRate = defencer.statuses.find(status => status.name === magicDiffenceDown.name) ? 0.8 : 1;

  return ((physical.VIT + physical.MND) * directRegistance * magicRegistance * upRate * downRate) / 100 / 100;
};

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

/* FIXME
 * 命中率の概念が実装途中
 * ボードゲームでやる以上、行動がキャンセルされる可能性があるのは戦略が練りづらくなる
 * ゲームに実装しても問題なさそうではあるが、上記の事情もあり、実装の手間もありpending状態
 * 命中率、回避率を操作するバフもあるので、命中率の概念がないと形骸化する点も留意。
 */
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
  (100 + calcAttackAccuracy(self, actor) - calcDefenceAccuracy(self, receiver)) / 100;
