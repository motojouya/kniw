import type { Acquirement, Race, Weapon, Clothing, Blessing } from '@motojouya/kniw/src/domain/acquirement';
import * as races from '@motojouya/kniw/src/data/acquirement/race/index';
import * as weapons from '@motojouya/kniw/src/data/acquirement/weapon/index';
import * as clothings from '@motojouya/kniw/src/data/acquirement/clothing/index';
import * as blessings from '@motojouya/kniw/src/data/acquirement/blessing/index';

type AcquirementDictionary = { [name: string]: Acquirement };

export type GetAcquirement<T> = (name: string) => T | null;

export const getRace: GetAcquirement<Race> = name => (races as AcquirementDictionary)[name];
export const raceNames: string[] = Object.keys(races as AcquirementDictionary);
export const allRaces: Race[] = Object.values(races as AcquirementDictionary);

export const getWeapon: GetAcquirement<Weapon> = name => (weapons as AcquirementDictionary)[name];
export const weaponNames: string[] = Object.keys(weapons as AcquirementDictionary);
export const allWeapons: Weapon[] = Object.values(weapons as AcquirementDictionary);

export const getClothing: GetAcquirement<Clothing> = name => (clothings as AcquirementDictionary)[name];
export const clothingNames: string[] = Object.keys(clothings as AcquirementDictionary);
export const allClothings: Clothing[] = Object.values(clothings as AcquirementDictionary);

export const getBlessing: GetAcquirement<Blessing> = name => (blessings as AcquirementDictionary)[name];
export const blessingNames: string[] = Object.keys(blessings as AcquirementDictionary);
export const allBlessings: Blessing[] = Object.values(blessings as AcquirementDictionary);
