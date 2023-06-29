import {
  Acquirement,
  Race,
  Weapon,
  Clothing,
  Blessing,
} from 'src/domain/acquirement'
import * as races from 'src/data/acquirement/race'
import * as weapons from 'src/data/acquirement/weapon'
import * as clothings from 'src/data/acquirement/clothing'
import * as blessings from 'src/data/acquirement/blessing'

type AcquirementDictionary = { [name: string]: Acquirement };

export type CreateAcquirement<T> = (name: string) => T | null;

export const createRace: CreateAcquirement<Race> = name => (races as AcquirementDictionary)[name];
export const createWeapon: CreateAcquirement<Weapon> = name => (weapons as AcquirementDictionary)[name];
export const createClothing: CreateAcquirement<Clothing> = name => (clothings as AcquirementDictionary)[name];
export const createBlessing: CreateAcquirement<Blessing> = name => (blessings as AcquirementDictionary)[name];

