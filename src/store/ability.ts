import type { Ability } from 'src/domain/ability'
import * as abilities from 'src/data/ability'

type AbilityDictionary = { [name: string]: Ability };

export type CreateAbility = (name: string) => Ability | null;
export const createAbility: CreateAbility = name => (abilities as AbilityDictionary)[name];

