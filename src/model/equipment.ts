import { Ability } from 'src/model/ability'
import { Skill } from 'src/model/skill'

type Equipment = {
  name: string,
  skills: Skill[],
  abilities: Ability[],
  additionalPhysical: Physical,
}

export type Weapon = Equipment;
export type Armor = Equipment;
export type Element = Equipment;

