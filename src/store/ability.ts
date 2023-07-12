import type { Ability } from 'src/domain/ability';
import * as abilities from 'src/data/ability';

type AbilityDictionary = { [name: string]: Ability };

export type GetAbility = (name: string) => Ability | null;
export const getAbility: GetAbility = name => (abilities as AbilityDictionary)[name];
export const abilityNames: string[] = Object.keys(abilities as AbilityDictionary);
export const allAbility: Ability[] = Object.values(abilities as AbilityDictionary);
