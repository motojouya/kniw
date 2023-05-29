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
  Save,
  Get,
  Remove,
  List,
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
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

export type CharactorMaking =
  Pick<Charactor, 'name'> |
  Pick<Charactor, 'name' | 'race'> |
  Pick<Charactor, 'name' | 'race' | 'blessing'> |
  Pick<Charactor, 'name' | 'race' | 'blessing' | 'clothing'> |
  Pick<Charactor, 'name' | 'race' | 'blessing' | 'clothing' | 'weapon'>

export type AcquirementNotFoundError = {
  acquirementName: string,
  type: string,
  message: string,
};

export function isAcquirementNotFoundError(obj: any): obj is AcquirementNotFoundError {
  return !!obj && typeof obj === 'object' && 'acquirementName' in obj && 'type' in obj && 'message' in obj;
}

export type GetAbilities = (charactor: Charactor) => Ability[];
export const getAbilities: GetAbilities = charactor => [
  ...charactor.race.abilities,
  ...charactor.blessing.abilities,
  ...charactor.clothing.abilities,
  ...charactor.weapon.abilities,
];

export type GetSkills = (charactor: Charactor) => Skill[];
export const getSkills: GetSkills = charactor => [
  ...charactor.race.skills,
  ...charactor.blessing.skills,
  ...charactor.clothing.skills,
  ...charactor.weapon.skills,
];

export type GetPhysical = (charactor: Charactor) => Physical;
export const getPhysical: GetPhysical = charactor => addPhysicals([
  basePhysical,
  charactor.race.additionalPhysical,
  charactor.blessing.additionalPhysical,
  charactor.clothing.additionalPhysical,
  charactor.weapon.additionalPhysical,
]);

export type CreateCharactor =
  (name: string, raceName: string, blessingName: string, clothingName: string, weaponName: string) =>
  Charactor | NotWearableErorr | AcquirementNotFoundError;
export const createCharactor: CreateCharactor = (name, raceName, blessingName, clothingName, weaponName) => {

  const race = createRace(raceName);
  if (!race) {
    return {
      acquirementName: raceName,
      type: 'race',
      message: raceName + 'という種族は存在しません',
    };
  }

  const blessing = createBlessing(blessingName);
  if (!blessing) {
    return {
      acquirementName: blessingName,
      type: 'blessing',
      message: blessingName + 'という祝福は存在しません',
    };
  }

  const clothing = createClothing(clothingName);
  if (!clothing) {
    return {
      acquirementName: clothingName,
      type: 'clothing',
      message: clothingName + 'という装備は存在しません',
    };
  }

  const weapon = createWeapon(weaponName);
  if (!weapon) {
    return {
      acquirementName: weaponName,
      type: 'weapon',
      message: weaponName + 'という武器は存在しません',
    };
  }

  const validateResult = validate({ name }, race, blessing, clothing, weapon);
  if (isNotWearableErorr(validateResult)) {
    return validateResult;
  }

  const someone: Charactor = {
    name,
    race,
    blessing,
    clothing,
    weapon,
    statuses: [],
    hp: 0,
    mp: 0,
    restWt: 0,
  };
  const someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHP;
  someone.restWt = someonesPhysical.WT;

  return someone;
};

type Validate = (someone: CharactorMaking, race: Race, blessing: Blessing, clothing: Clothing, weapon: Weapon) => NotWearableErorr | null;
const validate: Validate = (someone, race, blessing, clothing, weapon) => {

  let someoneMaking = { ...someone };

  const raceResult = race.wearable(someoneMaking);
  if (isNotWearableErorr(raceResult)) {
    return raceResult;
  }
  someoneMaking = {
    ...someoneMaking,
    race,
  };

  const blessingResult = blessing.wearable(someoneMaking);
  if (isNotWearableErorr(blessingResult)) {
    return blessingResult;
  }
  someoneMaking = {
    ...someoneMaking,
    blessing,
  };

  const clothingResult = clothing.wearable(someoneMaking);
  if (isNotWearableErorr(clothingResult)) {
    return clothingResult;
  }
  someoneMaking = {
    ...someoneMaking,
    clothing,
  };

  const weaponResult = weapon.wearable(someoneMaking);
  if (isNotWearableErorr(weaponResult)) {
    return weaponResult;
  }

  return null;
}

const createSave: CreateSave<Charactor> =
  repository =>
  async ({ name, race, blessing, clothing, weapon }) =>
  (await repository.save(NAMESPACE, name, { name, race: race.name, blessing: blessing.name, clothing: clothing.name, weapon: weapon.name }));

const createGet: CreateGet<Charactor> = repository => async name => {
  const result = await repository.get(NAMESPACE, name);
  const charactor = createCharactor(...result);
  if (isNotWearableErorr(charactor)) {
    return Promise.reject(charactor);
  }
  return charactor;
}

const createRemove: CreateRemove =
  repository =>
  async name =>
  (await repository.remove(NAMESPACE, name));

const createList: CreateList =
  repository =>
  async () =>
  (await repository.list(NAMESPACE));

export const createStorage: CreateStore<Charactor> = repository => {
  repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
  }
};

