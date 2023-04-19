import { Action } from 'src/model/action'
import { Charactor } from 'src/model/charactor'

type Randoms = {
  times: number
  damage: number
  accuracy: number
}

type Field = {
  climate: string
}

type ActionToCharactor = (actor: Charactor) => (randoms: Randoms) => (field: Field) => (receiver: Charactor) => Charactor;
type ActionToField = (actor: Charactor) => (randoms: Randoms) => (field: Field) => Field;
type Action = ActionToCharactor | ActionToField;
type GetAccuracy = (actor: Charactor) => (field: Field) => number;

type Skill = {
  name: string
  action: Action
  getAccuracy: GetAccuracy
};
