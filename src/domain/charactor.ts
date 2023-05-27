import { Physical, addPhysicals } from 'src/domain/physical'
import { Status } from 'src/domain/status'
import {
  Race,
  createRace,
  Weapon,
  createWeapon,
  Clothing,
  createClothing,
  Blessing,
  createBlessing
  NotWearableErorr,
  isNotWearableErorr,
} from 'src/domain/acquirement'
import { Ability } from 'src/domain/ability'
import { Skill } from 'src/domain/skill'
import {
  CreateSave<T>
  CreateGet<T>
  CreateRemove
  CreateList
  CreateStore<T>
} from 'src/domain/store';

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
  clothing: Clothing,
  blessing: Blessing,
  race: Race,
  statuses: Status[],
  hp: number,
  mp: number,
  restWt: number,
  isVisitor?: boolean,
}

export type CharactorBattling = Required<Charactor>;

export type CharactorMaking = Pick<Charactor, 'name'> | Pick<Charactor, 'name' | 'element'> | Pick<Charactor, 'name' | 'element' | 'armor'> | Pick<Charactor, 'name' | 'element' | 'armor' | 'weapon'>

export type GetAbilities = (charactor: Charactor) => Ability[];
export const getAbilities: GetAbilities = charactor => [...charactor.weapon.abilities, ...charactor.armor.abilities, ...charactor.element.abilities];

export type GetSkills = (charactor: Charactor) => Skill[];
export const getSkills: GetSkills = charactor => [...charactor.weapon.skills, ...charactor.armor.skills, ...charactor.element.skills];

export type GetPhysical = (charactor: Charactor) => Physical;
export const getPhysical: GetPhysical = charactor => addPhysicals([basePhysical, charactor.weapon.additionalPhysical, charactor.armor.additionalPhysical, charactor.element.additionalPhysical]);

export type CreateCharactor = (name: string, weapon: Weapon, armor: Armor, element: Element) => Charactor | NotWearableErorr;
export const createCharactor: CreateCharactor = (name, raceName, blessingName, clothingName, weaponName) => {

  const race = createBlessing(raceName);
  const blessing = createBlessing(blessingName);
  const clothing = createClothing(clothingName);
  const weapon = createWeapon(weaponName);

  const validateResult = validate({ name }, race, element, armor, weapon);
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

type Validate = (someone: CharactorMaking, race: Race, blessing: Blessing, clothing: Clothing, weapon: Weapon) => NotWearableErorr | null;
const validate: Validate = (someone, race, blessing, clothing, weapon) => {

  let someoneMaking = { ...someone };

  const raceResult = race.wearable(someone);
  if (isNotWearableErorr(raceResult)) {
    return raceResult;
  }
  someoneMaking = {
    ...someoneMaking,
    element,
  };

  const blessingResult = blessing.wearable(someone);
  if (isNotWearableErorr(blessingResult)) {
    return blessingResult;
  }
  someoneMaking = {
    ...someoneMaking,
    element,
  };

  const clothingResult = clothing.wearable(someone);
  if (isNotWearableErorr(clothingResult)) {
    return clothingResult;
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
  async ({ name, race, blessing, clothing, weapon }) =>
  (await storage.save(NAMESPACE, name, { name, race: race.name, blessing: blessing.name, clothing: clothing.name, weapon: weapon.name }));

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

