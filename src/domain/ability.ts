import { Ability } from 'src/model/ability'
import * as abilities from 'src/data/ability'

export type Ability = {
  name: string,
  label: string,
  wait: Wait,
  description: string,
};

export type Wait = (wt: number, charactor: Charactor, randoms: Randoms) => Charactor;
export const justWait: Wait = (wt, charactor, randoms) => charactor;

