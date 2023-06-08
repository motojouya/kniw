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

type AbilityDictionary = { [name: string]: Ability };

export type CreateAbility = (name: string) => Ability | null;
export const createAbility: CreateAbility = name => (abilities as AbilityDictionary)[name];

