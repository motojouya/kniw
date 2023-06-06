import { Ability } from 'src/domain/ability'
import { Physical } from 'src/domain/physical'
import { Skill } from 'src/domain/skill'
import races from 'src/data/acquirement/race'
import weapons from 'src/data/acquirement/weapon'
import clothings from 'src/data/acquirement/clothing'
import blessings from 'src/data/acquirement/blessing'

type Acquirement = {
  name: string,
  label: string,
  skills: Skill[],
  abilities: Ability[],
  additionalPhysical: Physical,
  validateWearable: ValidateWearable,
  description: string,
}

type AcquirementDictionary = { [name: string]: Acquirement };

export type ValidateWearable = (race: Race | null, weapon: Weapon | null, clothing: Clothing | null, blessing: Blessing | null) => null | NotWearableErorr;

export type CreateValidateWearable = (self: Acquirement, wearableAcquirements: { wearableRaces: string[], wearableBlessings: string[], wearableClothings: string[], wearableWeapons: string[] }) => ValidateWearable;
export const createValidateWearable: CreateValidateWearable = (self, { wearableRaces, wearableBlessings, wearableClothings, wearableWeapons }) => (race, weapon, clothing, blessing) => {

  if (wearableRaces.length > 0 && !!race) {
    const raceWearable = wearableRaces.includes(race.name);
    if (!raceWearable) {
      return {
        acquirement: self,
        cause: race,
        message: 'このキャラクターの設定では' + self.name + 'になることはできません。',
      };
    }
  }

  if (wearableBlessings.length > 0 && !!blessing) {
    const blessingWearable = wearableBlessings.includes(blessing.name);
    if (!blessingWearable) {
      return {
        acquirement: self,
        cause: blessing,
        message: 'このキャラクターの設定では' + self.name + 'の祝福を受けることはできません。',
      };
    }
  }

  if (wearableClothings.length > 0 && !!clothing) {
    const clothingWearable = wearableClothings.includes(clothing.name);
    if (!clothingWearable) {
      return {
        acquirement: self,
        cause: clothing,
        message: 'このキャラクターの設定では' + self.name + 'を装備することはできません。',
      };
    }
  }

  if (wearableWeapons.length > 0 && !!weapon) {
    const weaponWearable = wearableWeapons.includes(weapon.name);
    if (!weaponWearable) {
      return {
        acquirement: self,
        cause: weapon,
        message: 'このキャラクターの設定では' + self.name + 'を持つことはできません。',
      };
    }
  }

  return null;
};

export const tentativeValidateWearable: ValidateWearable = (race, weapon, clothing, blessing) => null;

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

