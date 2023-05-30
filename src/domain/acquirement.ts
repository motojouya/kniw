import { Ability } from 'src/domain/ability'
import { Physical } from 'src/domain/physical'
import { Skill } from 'src/domain/skill'
import { CharactorMaking } from 'src/domain/charactor';
import races from 'src/data/acquirement/race'
import weapons from 'src/data/acquirement/weapon'
import clothings from 'src/data/acquirement/clothing'
import blessings from 'src/data/acquirement/blessing'

type Acquirement = {
  name: string,
  skills: Skill[],
  abilities: Ability[],
  additionalPhysical: Physical,
  wearable: Wearable,
  description: string,
}

type AcquirementDictionary = { [name: string]: Acquirement };

export type Wearable = (charactor: CharactorMaking) => null | NotWearableErorr;

export type Race = Acquirement;
export type Weapon = Acquirement;
export type Clothing = Acquirement;
export type Blessing = Acquirement;

export type CreateAcquirement<T> = (name: string) => T | null;

export const createRace: CreateAcquirement<Race> = name => (races as AcquirementDictionary)[name];
export const createWeapon: CreateAcquirement<Weapon> = name => (weapons as AcquirementDictionary)[name];
export const createClothing: CreateAcquirement<Clothing> = name => (clothings as AcquirementDictionary)[name];
export const createBlessing: CreateAcquirement<Blessing> = name => (blessings as AcquirementDictionary)[name];

export type NotWearableErorr = {
  acquirement: Acquirement
  cause: Acquirement
  message: string,
};

export function isNotWearableErorr(obj: any): obj is NotWearableErorr {
  return !!obj && typeof obj === 'object' && 'type' in obj && 'cause' in obj && 'message' in obj;
}

