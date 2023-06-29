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
} from 'src/store/acquirement'
import { Ability } from 'src/domain/ability'
import { Skill } from 'src/domain/skill'
import { JsonSchemaUnmatchError, isJsonSchemaUnmatchError } from 'src/domain/store';

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
  },
  required: ["name", "race", "blessing", "clothing", "weapon"],
} as const;

export type CharactorJson = FromSchema<typeof charactorSchema>;

export class AcquirementNotFoundError {
  constructor(
    public acquirementName: string,
    public type: string,
    public message: string,
  ) {}
}

export function isAcquirementNotFoundError(obj: any): obj is AcquirementNotFoundError {
  return obj instanceof AcquirementNotFoundError;
}

export type CreateCharactorJson = (charactor: Charactor) => CharactorJson;
export const createCharactorJson: CreateCharactorJson = charactor => ({
  name: charactor.name,
  race: charactor.race.name,
  blessing: charactor.blessing.name,
  clothing: charactor.clothing.name,
  weapon: charactor.weapon.name,
});

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

