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

export type GetAcquirement<T> = (name: string) => T | null;

export const getRace: GetAcquirement<Race> = name => (races as AcquirementDictionary)[name];
export const getWeapon: GetAcquirement<Weapon> = name => (weapons as AcquirementDictionary)[name];
export const getClothing: GetAcquirement<Clothing> = name => (clothings as AcquirementDictionary)[name];
export const getBlessing: GetAcquirement<Blessing> = name => (blessings as AcquirementDictionary)[name];

