import { Equipment } from 'src/model/equipment'
import { Ability } from 'src/model/ability'

//Equipment用のモジュールを用意したい
export type Equipment = {
  weapon: Weapon,
  armor: Armor,
  element: Element,
  getSkills: GetSkills,
  getAbilities: GetAbilities,
  getAdditionalPhysical: GetPhysical,
}

export type Physical = {
  STR: number,
  VIT: number,
  DEX: number,
  AGI: number,
  AVD: number,
  INT: number,
  MND: number,
  RES: number,
  WT: number,
};

export type GetAbilities = (self: Charactor) => Ability[];
export type GetSkills = (self: Charactor) => Skill[];
export type GetPhysical = (self: Charactor) => Physical;
export type GetStatuses = (self: Charactor) => string[];
export type GetHP = (self: Charactor) => number;
export type GetMP = (self: Charactor) => number;

export type Charactor = {
  name: string,
  equipment: Equipment,
  getAbilities: GetAbilities,
  getSkills: GetSkills,
  getPhysical: GetPhysical,
  getStatuses: GetStatuses,
  getHP: GetHP,
  getMP: GetMP,
}

