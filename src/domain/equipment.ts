import { Ability } from 'src/model/ability'
import { Skill } from 'src/model/skill'
import { CharactorMaking } from 'src/model/charactor';
import { races } from 'src/store/equipment/race'
import { weapons } from 'src/store/equipment/weapon'
import { armors } from 'src/store/equipment/armor'
import { elements } from 'src/store/equipment/element'

type Equipment = {
  name: string,
  description: string,
  skills: Skill[],
  abilities: Ability[],
  additionalPhysical: Physical,
  wearable: Wearable,
  description: string,
}

export type Wearable = (charactor: CharactorMaking) => string | null;

export type Race = Equipment;
export type Weapon = Equipment;
export type Armor = Equipment;
export type Element = Equipment;

export type CreateEquipment = (name: string) => Equipment;

export type CreateRace = CreateEquipment;
export const createRace: CreateRace = name => races.find(race => name === race.name);

export type CreateWeapon = CreateEquipment;
export const createWeapon: CreateWeapon = name => weapons.find(weapon => name === weapon.name);

export type CreateArmor = CreateEquipment;
export const createArmor: CreateArmor = name => armors.find(armor => name === armor.name);

export type CreateElement = CreateEquipment;
export const createElement: CreateElement = name => elements.find(element => name === element.name);

export type NotWearableErorr = {
  equipment: Equipment
  cause: Equipment
  message: string,
};

export function isNotWearableErorr(obj: any): obj is NotWearableErorr {
  return "type" in obj && "cause" in obj && "message" in obj;
}

