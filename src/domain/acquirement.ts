import { Ability } from 'src/model/ability'
import { Skill } from 'src/model/skill'
import { CharactorMaking } from 'src/model/charactor';
import { races } from 'src/store/acquirement/race'
import { weapons } from 'src/store/acquirement/weapon'
import { clothings } from 'src/store/acquirement/clothing'
import { blessings } from 'src/store/acquirement/blessing'

type Acquirement = {
  name: string,
  description: string,
  skills: Skill[],
  abilities: Ability[],
  additionalPhysical: Physical,
  wearable: Wearable,
  description: string,
}

export type Wearable = (charactor: CharactorMaking) => null | NotWearableErorr;

export type Race = Acquirement;
export type Weapon = Acquirement;
export type Clothing = Acquirement;
export type Blessing = Acquirement;

export type CreateAcquirement = (name: string) => Acquirement | null;

export type CreateRace = CreateAcquirement;
export const createRace: CreateRace = name => races.find(race => name === race.name);

export type CreateWeapon = CreateAcquirement;
export const createWeapon: CreateWeapon = name => weapons.find(weapon => name === weapon.name);

export type CreateArmor = CreateAcquirement;
export const createArmor: CreateArmor = name => clothings.find(clothing => name === clothing.name);

export type CreateElement = CreateAcquirement;
export const createElement: CreateElement = name => blessings.find(blessing => name === blessing.name);

export type NotWearableErorr = {
  acquirement: Acquirement
  cause: Acquirement
  message: string,
};

export function isNotWearableErorr(obj: any): obj is NotWearableErorr {
  return !!obj && typeof obj === 'object' && 'type' in obj && 'cause' in obj && 'message' in obj;
}

