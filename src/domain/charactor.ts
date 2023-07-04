import { Physical, addPhysicals } from 'src/domain/physical'
import { Status } from 'src/domain/status'
import {
  Race,
  Weapon,
  Clothing,
  Blessing,
  NotWearableErorr,
} from 'src/domain/acquirement'
import {
  createRace,
  createWeapon,
  createClothing,
  createBlessing,
} from 'src/store/acquirement'
import { Ability } from 'src/domain/ability'
import { Skill } from 'src/domain/skill'
import { JsonSchemaUnmatchError } from 'src/store/store';

import { FromSchema } from "json-schema-to-ts";
import { createValidationCompiler } from 'src/io/json_schema'

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
    statuses: { type: "array", items: {} },
    hp: { type: "integer" },
    mp: { type: "integer" },
    restWt: { type: "integer" },
    isVisitor: { type: "boolean" },
  },
  required: ["name", "race", "blessing", "clothing", "weapon", "statuses", "hp", "mp", "restWt"],
} as const;

export type CharactorJson = FromSchema<typeof charactorSchema>;

export class AcquirementNotFoundError {
  constructor(
    public acquirementName: string,
    public type: string,
    public message: string,
  ) {}
}

export type CreateCharactorJson = (charactor: Charactor) => CharactorJson;
export const createCharactorJson: CreateCharactorJson = charactor => {

  const json = {
    name: charactor.name,
    race: charactor.race.name,
    blessing: charactor.blessing.name,
    clothing: charactor.clothing.name,
    weapon: charactor.weapon.name,
    statuses: Status[],
    hp: charactor.hp,
    mp: charactor.mp,
    restWt: charactor.restWt,
    isVisitor: charactor.isVisitor,
  };

  if (charactor.hasOwnProperty('isVisitor')) {
    json.isVisitor = charactor.isVisitor;
  }

  return json;
};

type Validate = (name: string, race: Race, blessing: Blessing, clothing: Clothing, weapon: Weapon) => NotWearableErorr | null;
const validate: Validate = (name, race, blessing, clothing, weapon) => {

  const raceResult = race.validateWearable(race, blessing, clothing, weapon);
  if (raceResult instanceof NotWearableErorr) {
    return raceResult;
  }

  const blessingResult = blessing.validateWearable(race, blessing, clothing, weapon);
  if (blessingResult instanceof NotWearableErorr) {
    return blessingResult;
  }

  const clothingResult = clothing.validateWearable(race, blessing, clothing, weapon);
  if (clothingResult instanceof NotWearableErorr) {
    return clothingResult;
  }

  const weaponResult = weapon.validateWearable(race, blessing, clothing, weapon);
  if (weaponResult instanceof NotWearableErorr) {
    return weaponResult;
  }

  return null;
}

export type CreateCharactor = (charactorJson: any) => Charactor | NotWearableErorr | AcquirementNotFoundError | JsonSchemaUnmatchError;
export const createCharactor: CreateCharactor = charactorJson => {

  const compile = createValidationCompiler();
  const validateSchema = compile(charactorSchema)
  if (!validateSchema(charactorJson)) {
    // @ts-ignore
    const errors = validateSchema.errors;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'charactorのjsonデータではありません');
  }

  const name = charactorJson.name;

  const race = createRace(charactorJson.race);
  if (!race) {
    return new AcquirementNotFoundError(charactorJson.race, 'race', charactorJson.race + 'という種族は存在しません');
  }

  const blessing = createBlessing(charactorJson.blessing);
  if (!blessing) {
    return new AcquirementNotFoundError(charactorJson.blessing, 'blessing', charactorJson.blessing + 'という祝福は存在しません');
  }

  const clothing = createClothing(charactorJson.clothing);
  if (!clothing) {
    return new AcquirementNotFoundError(charactorJson.clothing, 'clothing', charactorJson.clothing + 'という装備は存在しません');
  }

  const weapon = createWeapon(charactorJson.weapon);
  if (!weapon) {
    return new AcquirementNotFoundError(charactorJson.weapon, 'weapon', charactorJson.weapon + 'という武器は存在しません');
  }

  const validateResult = validate(name, race, blessing, clothing, weapon);
  if (validateResult instanceof NotWearableErorr) {
    return validateResult;
  }

  const someone: Charactor = {
    name,
    race,
    blessing,
    clothing,
    weapon,
    statuses: [],
    hp: 0 + charactorJson.hp,
    mp: 0 + charactorJson.mp,
    restWt: 0 + charactorJson.restWt,
  };
  const someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHP;
  someone.restWt = someonesPhysical.WT;

  return someone;
};

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

