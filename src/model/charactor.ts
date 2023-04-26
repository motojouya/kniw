import { Status, Physical, addPhysicals } from 'src/model/basics'
import {
  Weapon,
  createWeapon,
  Armor,
  createArmor,
  Element,
  createElement
} from 'src/model/equipment'
import { Ability } from 'src/model/ability'
import { Skill } from 'src/model/skill'
import {
  CreateSave<T>
  CreateGet<T>
  CreateRemove
  CreateList
  CreateStore<T>
} from 'src/mode/store';

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
  restWt: number,
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
    restWt: 0,
  };
  someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHp;
  someone.restWt = someonesPhysical.wt;
  return someone;
};

const createSave: CreateSave<Charactor> =
  storage =>
  async ({ name, weapon, armor, element }) =>
  (await storage.save(NAMESPACE, name, { weapon: weapon.name, armor: armor.name, element: element.name }));

const createGet: CreateGet<Charactor> =
  storage =>
  async name =>
  createCharactor(...(await storage.get(NAMESPACE, name)));

const createRemove: CreateRemove =
  storage =>
  async name =>
  (await storage.remove(NAMESPACE, name));

const createList: CreateList =
  storage =>
  async () =>
  (await storage.list(NAMESPACE));

export const createStorage: CreateStore<Charactor> = storage => {
  storage.checkNamespace(NAMESPACE);
  return {
    save: createSave(storage),
    list: createList(storage),
    get: createGet(storage),
    remove: createRemove(storage),
  }
};

