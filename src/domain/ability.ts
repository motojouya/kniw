import { Ability } from 'src/model/ability'
import { abilities } from 'src/data/ability'

export type Ability = {
  name: string,
  wait: Wait,
  description: string,
};

export type Wait = (wt: number, charactor: Charactor, randoms: Randoms) => Charactor;

export type CreateAbility = (name: string) => Ability;
export const createAbility: CreateAbility = name => abilities.find(ability => name === ability.name);
