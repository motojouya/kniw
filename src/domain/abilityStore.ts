import type { Ability } from 'src/domain/ability'

type AbilityDictionary = { [name: string]: Ability };

export type CreateAbility = (name: string) => Ability | null;
export const createAbility: CreateAbility = name => (abilities as AbilityDictionary)[name];

