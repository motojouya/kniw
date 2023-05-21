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

