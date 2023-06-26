import { Physical, addPhysicals } from 'src/domain/physical'
import { Status } from 'src/domain/status'
import {
  Race,
  Weapon,
  Clothing,
  Blessing,
  NotWearableErorr,
  isNotWearableErorr,
} from 'src/domain/acquirement'
import {
  createRace,
  createWeapon,
  createClothing,
  createBlessing,
} from 'src/domain/acquirementStore'
import { Ability } from 'src/domain/ability'
import { Skill } from 'src/domain/skill'
import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
  JsonSchemaUnmatchError,
} from 'src/domain/store';
import { isJsonSchemaUnmatchError } from 'src/domain/store';

import { FromSchema } from "json-schema-to-ts";
import Ajv from "ajv"

const ajv = new Ajv();

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

export const charactorSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    race: { type: "string" },
    blessing: { type: "string" },
    clothing: { type: "string" },
    weapon: { type: "string" },
  },
  required: ["name", "race", "blessing", "clothing", "weapon"],
} as const;

export type CharactorJson = FromSchema<typeof charactorSchema>;

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

export type CreateCharactor = (charactorJson: any) => Charactor | NotWearableErorr | AcquirementNotFoundError | JsonSchemaUnmatchError;
export const createCharactor: CreateCharactor = charactorJson => {

  const validateSchema = ajv.compile(charactorSchema)
  const valid = validateSchema(charactorJson)
  if (!valid) {
    console.debug(validateSchema.errors);
    return {
      error: validateSchema.errors,
      message: 'charactorのjsonデータではありません',
    };
  }
  const validCharactor = charactorJson as CharactorJson;

  const name = validCharactor.name;

  const race = createRace(validCharactor.race);
  if (!race) {
    return {
      acquirementName: validCharactor.race,
      type: 'race',
      message: validCharactor.race + 'という種族は存在しません',
    };
  }

  const blessing = createBlessing(validCharactor.blessing);
  if (!blessing) {
    return {
      acquirementName: validCharactor.blessing,
      type: 'blessing',
      message: validCharactor.blessing + 'という祝福は存在しません',
    };
  }

  const clothing = createClothing(validCharactor.clothing);
  if (!clothing) {
    return {
      acquirementName: validCharactor.clothing,
      type: 'clothing',
      message: validCharactor.clothing + 'という装備は存在しません',
    };
  }

  const weapon = createWeapon(validCharactor.weapon);
  if (!weapon) {
    return {
      acquirementName: validCharactor.weapon,
      type: 'weapon',
      message: validCharactor.weapon + 'という武器は存在しません',
    };
  }

  const validateResult = validate(name, race, blessing, clothing, weapon);
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

type Validate = (name: string, race: Race, blessing: Blessing, clothing: Clothing, weapon: Weapon) => NotWearableErorr | null;
const validate: Validate = (name, race, blessing, clothing, weapon) => {

  const raceResult = race.validateWearable(race, blessing, clothing, weapon);
  if (isNotWearableErorr(raceResult)) {
    return raceResult;
  }

  const blessingResult = blessing.validateWearable(race, blessing, clothing, weapon);
  if (isNotWearableErorr(blessingResult)) {
    return blessingResult;
  }

  const clothingResult = clothing.validateWearable(race, blessing, clothing, weapon);
  if (isNotWearableErorr(clothingResult)) {
    return clothingResult;
  }

  const weaponResult = weapon.validateWearable(race, blessing, clothing, weapon);
  if (isNotWearableErorr(weaponResult)) {
    return weaponResult;
  }

  return null;
}

export type CreateCharactorJson = (charactor: Charactor) => CharactorJson;
export const createCharactorJson: CreateCharactorJson = charactor => ({
  name: charactor.name,
  race: charactor.race.name,
  blessing: charactor.blessing.name,
  clothing: charactor.clothing.name,
  weapon: charactor.weapon.name,
});

const createSave: CreateSave<Charactor> =
  repository =>
  async obj =>
  (await repository.save(NAMESPACE, obj.name, createCharactorJson(obj)));

const createGet: CreateGet<Charactor> = repository => async name => {
  const result = await repository.get(NAMESPACE, name);
  if (!result) {
    return null;
  }
  const charactor = createCharactor(result);
  if (isNotWearableErorr(charactor) || isAcquirementNotFoundError(charactor) || isJsonSchemaUnmatchError(charactor)) {
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

export const createStore: CreateStore<Charactor> = repository => {
  repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
  }
};

