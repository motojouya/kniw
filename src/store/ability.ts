import type { Ability } from '@motojouya/kniw/src/domain/ability';
import * as abilities from '@motojouya/kniw/src/data/ability/index';

type AbilityDictionary = { [name: string]: Ability };

export type GetAbility = (name: string) => Ability | null;
export const getAbility: GetAbility = name => (abilities as AbilityDictionary)[name];
export const abilityNames: string[] = Object.keys(abilities as AbilityDictionary);
export const allAbility: Ability[] = Object.values(abilities as AbilityDictionary);
