import { Physical, addPhysicals } from 'src/model/basics'
import { Weapon, createWeapon, Armor, createArmor, Element, createElement } from 'src/model/equipment'
import { Ability } from 'src/model/ability'
import { Skill } from 'src/model/skill'
import {
  save as saveToStorage,
  list as listFromStorage,
  get as getFromStorage,
  remove as removeFromStorage
} from 'src/repository/file_storage'

const NAMESPACE = 'charactor';

const basePhysical: Physical = {
  MaxHP: 100,
  MaxMP: 100,
  STR: 100,
  VIT: 100,
  DEX: 100,
  AGI: 100,
  AVD: 100,
  INT: 100,
  MND: 100,
  RES: 100,
  WT: 100,
};

export type Charactor = {
  name: string,
  weapon: Weapon,
  armor: Armor,
  element: Element,
  statuses: Status[],
  hp: number,
  mp: number,
}

export type GetAbilities = (charactor: Charactor) => Ability[];
const getAbilities: GetAbilities = charactor => [...charactor.weapon.abilities, ...charactor.armor.abilities, ...charactor.element.abilities];

export type GetSkills = (charactor: Charactor) => Skill[];
const getSkills: GetSkills = charactor => [...charactor.weapon.skills, ...charactor.armor.skills, ...charactor.element.skills];

export type GetPhysical = (charactor: Charactor) => Physical;
const getPhysical: GetPhysical = charactor => addPhysicals([basePhysical, charactor.weapon.additionalPhysical, charactor.armor.additionalPhysical, charactor.element.additionalPhysical]);

export type CreateCharactor = (name: string, weapon: Weapon, armor: Armor, element: Element) => Charactor;
export const createCharactor: CreateCharactor = (name: string, weaponName: string, armorName: string, elementName: string) => {
  const someone: Charactor = {
    name,
    weapon: createWeapon(weaponName),
    armor: createArmor(armorName),
    element: createElement(elementName),
    statuses: [],
    hp: 0,
    mp: 0,
  };
  someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHp;
  return someone;
};

export type Save = (charactor: Charactor) => Promise<void>
export const save: Save = async ({ name, weapon, armor, element }) => (await saveToStorage(NAMESPACE, name, { weapon: weapon.name, armor: armor.name, element: element.name }));

export type Get = (name: string) => Promise<Charactor>
export const get: Get = async name => createCharactor(...(await getFromStorage(NAMESPACE, name)));

export type Remove = (name: string) => Promise<void>
export const remove: Remove = async name => (await removeFromStorage(NAMESPACE, name));

export type List = () => Promise<string[]>
export const list: List = async () => (await listFromStorage(NAMESPACE));


//同様にBattleLog, Party型も
//BattleLogはモジュールとしてbattle関数を定義してもいいかもしれない。ちょくちょく対話したりコンソールにメッセージ出したりするので、そこをどう扱うかな
//Ability型を作って上げる必要がある

