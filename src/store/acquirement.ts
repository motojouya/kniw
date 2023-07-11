import { Acquirement, Race, Weapon, Clothing, Blessing } from 'src/domain/acquirement';
import * as races from 'src/data/acquirement/race';
import * as weapons from 'src/data/acquirement/weapon';
import * as clothings from 'src/data/acquirement/clothing';
import * as blessings from 'src/data/acquirement/blessing';

type AcquirementDictionary = { [name: string]: Acquirement };

export type GetAcquirement<T> = (name: string) => T | null;

export const getRace: GetAcquirement<Race> = name => (races as AcquirementDictionary)[name];
export const raceNames: string[] = Object.keys(races as AcquirementDictionary);
export const allRaces: AcquirementDictionary = races as AcquirementDictionary;

export const getWeapon: GetAcquirement<Weapon> = name => (weapons as AcquirementDictionary)[name];
export const weaponNames: string[] = Object.keys(weapons as AcquirementDictionary);
export const allWeapons: AcquirementDictionary = weapons as AcquirementDictionary;

export const getClothing: GetAcquirement<Clothing> = name => (clothings as AcquirementDictionary)[name];
export const clothingNames: string[] = Object.keys(clothings as AcquirementDictionary);
export const allClothings: AcquirementDictionary = clothings as AcquirementDictionary;

export const getBlessing: GetAcquirement<Blessing> = name => (blessings as AcquirementDictionary)[name];
export const blessingNames: string[] = Object.keys(blessings as AcquirementDictionary);
export const allBlessings: AcquirementDictionary = blessings as AcquirementDictionary;

