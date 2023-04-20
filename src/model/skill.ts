import { Action } from 'src/model/action'
import { Charactor } from 'src/model/charactor'

export type Randoms = {
  times: number,
  damage: number,
  accuracy: number,
}

export type Field = {
  climate: string
}

export type ActionToCharactor = (self: Skill) => (actor: Charactor) => (randoms: Randoms) => (field: Field) => (receiver: Charactor) => Charactor;
export type ActionToField = (self: Skill) => (actor: Charactor) => (randoms: Randoms) => (field: Field) => Field;
export type GetAccuracy = (self: Skill) => (actor: Charactor) => (field: Field) => (receiver: Charactor) => number;

export type Skill = {
  name: string,
  action: ActionToCharactor,
  receiverCount: number,
  getAccuracy: GetAccuracy,
} | {
  name: string,
  action: ActionToField,
  receiverCount: 0,
  getAccuracy: GetAccuracy,
};

//dryrun関数の中では、ramdomsが固定でactionTimesが>1でも1回のみ実行
//actionTimesが0の場合はfieldに影響を及ぼすタイプのやつ

