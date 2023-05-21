import { Status, Physical, addPhysicals } from 'src/model/basics'
import {
  Weapon,
  createWeapon,
  Clothing,
  createClothing,
  Blessing,
  createBlessing
  NotWearableErorr,
  isNotWearableErorr,
} from 'src/model/acquirement'
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
  isVisitor?: boolean,
}

export type CharactorBattling = Required<Charactor>;

export type CharactorMaking = Pick<Charactor, 'name'> | Pick<Charactor, 'name' | 'element'> | Pick<Charactor, 'name' | 'element' | 'armor'> | Pick<Charactor, 'name' | 'element' | 'armor' | 'weapon'>

export type GetAbilities = (charactor: Charactor) => Ability[];
const getAbilities: GetAbilities = charactor => [...charactor.weapon.abilities, ...charactor.armor.abilities, ...charactor.element.abilities];

export type GetSkills = (charactor: Charactor) => Skill[];
const getSkills: GetSkills = charactor => [...charactor.weapon.skills, ...charactor.armor.skills, ...charactor.element.skills];

export type GetPhysical = (charactor: Charactor) => Physical;
const getPhysical: GetPhysical = charactor => addPhysicals([basePhysical, charactor.weapon.additionalPhysical, charactor.armor.additionalPhysical, charactor.element.additionalPhysical]);

export type CreateCharactor = (name: string, weapon: Weapon, armor: Armor, element: Element) => Charactor | NotWearableErorr;
export const createCharactor: CreateCharactor = (name, weaponName, armorName, elementName) => {

  const element = createElement(elementName);
  const armor = createArmor(armorName);
  const weapon = createWeapon(weaponName);

  const validateResult = validate({ name }, element, armor, weapon);
  if (isNotWearableErorr(validateResult)) {
    return validateMessage;
  }

  const someone: Charactor = {
    name,
    weapon,
    armor,
    element,
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

type Validate = (someone: CharactorMaking, element: Element, armor: Armor, weapon: Weapon) => NotWearableErorr | null;
const validate: Validate = (someone, element, armor, weapon) => {

  let someoneMaking = { ...someone };

  const elementResult = element.wearable(someone);
  if (isNotWearableErorr(elementResult)) {
    return elementResult;
  }
  someoneMaking = {
    ...someoneMaking,
    element,
  };

  const armorResult = armor.wearable(someone);
  if (isNotWearableErorr(armorResult)) {
    return armorResult;
  }
  someoneMaking = {
    ...someoneMaking,
    armor,
  };

  const weaponResult = weapon.wearable(someone);
  if (isNotWearableErorr(weaponResult)) {
    return weaponResult;
  }

  return null;
}

const createSave: CreateSave<Charactor> =
  storage =>
  async ({ name, weapon, armor, element }) =>
  (await storage.save(NAMESPACE, name, { name, weapon: weapon.name, armor: armor.name, element: element.name }));

const createGet: CreateGet<Charactor> = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  const charactor = createCharactor(...result);
  if (isNotWearableErorr(charactor)) {
    return Promise.reject(charactor);
  }
  return charactor;
}

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

