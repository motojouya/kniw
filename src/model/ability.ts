import { Ability } from 'src/model/ability'
import { abilities } from 'src/store/equipment/ability'

type Ability = {
  name: string,
  description: string,
}

export type CreateAbility = (name: string) => Ability;
export const createAbility: CreateAbility = name => abilities.find(ability => name === ability.name);
