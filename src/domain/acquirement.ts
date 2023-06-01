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
  ValidateWearable: ValidateWearable,
  description: string,
}

type AcquirementDictionary = { [name: string]: Acquirement };

export type ValidateWearable = (charactor: CharactorMaking) => null | NotWearableErorr;

export type CreateValidateWearable = (self: Acquirement, { wearableRaces: string[], wearableBlessings: string[], wearableClothings: string[], wearableWeapons: string[] }) => ValidateWearable;
export const createValidateWearable: CreateValidateWearable = (self, { wearableRaces, wearableBlessings, wearableClothings, wearableWeapons }) => charactor => {

  if (wearableRaces.length > 0) {
    const raceWearable = wearableRaces.includes(charactor.race.name);
    if (!raceWearable) {
      return {
        acquirement: self,
        cause: charactor.race
        message: 'このキャラクターの設定では' + self.name + 'になることはできません。',
      };
    }
  }

  if (wearableBlessings.length > 0) {
    const blessingWearable = wearableBlessings.includes(charactor.blessing.name);
    if (!blessingWearable) {
      return {
        acquirement: self,
        cause: charactor.blessing
        message: 'このキャラクターの設定では' + self.name + 'の祝福を受けることはできません。',
      };
    }
  }

  if (wearableClothings.length > 0) {
    const clothingWearable = wearableClothings.includes(charactor.clothing.name);
    if (!clothingWearable) {
      return {
        acquirement: self,
        cause: charactor.clothing
        message: 'このキャラクターの設定では' + self.name + 'を装備することはできません。',
      };
    }
  }

  if (wearableWeapons.length > 0) {
    const weaponWearable = wearableWeapons.includes(charactor.weapon.name);
    if (!weaponWearable) {
      return {
        acquirement: self,
        cause: charactor.weapon
        message: 'このキャラクターの設定では' + self.name + 'を持つことはできません。',
      };
    }
  }

  return null;
};

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

