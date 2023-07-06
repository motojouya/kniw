import { Physical, addPhysicals } from 'src/domain/physical';
import type { Status } from 'src/domain/status';
import { toStatus, toStatusJson } from 'src/domain/status';
import { Race, Weapon, Clothing, Blessing, NotWearableErorr } from 'src/domain/acquirement';
import { getRace, getWeapon, getClothing, getBlessing } from 'src/store/acquirement';
import { Ability } from 'src/domain/ability';
import { Skill } from 'src/domain/skill';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';

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
  name: string;
  weapon: Weapon;
  clothing: Clothing;
  blessing: Blessing;
  race: Race;
  statuses: Status[];
  hp: number;
  mp: number;
  restWt: number;
  isVisitor?: boolean;
};

export type CharactorBattling = Required<Charactor>;

export const charactorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    race: { type: 'string' },
    blessing: { type: 'string' },
    clothing: { type: 'string' },
    weapon: { type: 'string' },
    statuses: { type: 'array', items: {} },
    hp: { type: 'integer' },
    mp: { type: 'integer' },
    restWt: { type: 'integer' },
    isVisitor: { type: 'boolean' },
  },
  required: ['name', 'race', 'blessing', 'clothing', 'weapon', 'statuses', 'hp', 'mp', 'restWt'],
} as const;

export type CharactorJson = FromSchema<typeof charactorSchema>;

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
export const getPhysical: GetPhysical = charactor =>
  addPhysicals([
    basePhysical,
    charactor.race.additionalPhysical,
    charactor.blessing.additionalPhysical,
    charactor.clothing.additionalPhysical,
    charactor.weapon.additionalPhysical,
  ]);

export type ToCharactorJson = (charactor: Charactor) => CharactorJson;
export const toCharactorJson: ToCharactorJson = charactor => {
  const json = {
    name: charactor.name,
    race: charactor.race.name,
    blessing: charactor.blessing.name,
    clothing: charactor.clothing.name,
    weapon: charactor.weapon.name,
    statuses: charactor.statuses.map(toStatusJson),
    hp: charactor.hp,
    mp: charactor.mp,
    restWt: charactor.restWt,
    isVisitor: charactor.isVisitor,
  };

  if (Object.prototype.hasOwnProperty.call(charactor, 'isVisitor')) {
    json.isVisitor = charactor.isVisitor;
  }

  return json;
};

type Validate = (
  name: string,
  race: Race,
  blessing: Blessing,
  clothing: Clothing,
  weapon: Weapon,
) => NotWearableErorr | null;
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
};

export type ToCharactor = (
  charactorJson: any,
) => Charactor | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError;
export const toCharactor: ToCharactor = charactorJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(charactorSchema);
  if (!validateSchema(charactorJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'charactorのjsonデータではありません');
  }

  const { name } = charactorJson;

  const race = getRace(charactorJson.race);
  if (!race) {
    return new DataNotFoundError(charactorJson.race, 'race', `${charactorJson.race}という種族は存在しません`);
  }

  const blessing = getBlessing(charactorJson.blessing);
  if (!blessing) {
    return new DataNotFoundError(
      charactorJson.blessing,
      'blessing',
      `${charactorJson.blessing}という祝福は存在しません`,
    );
  }

  const clothing = getClothing(charactorJson.clothing);
  if (!clothing) {
    return new DataNotFoundError(
      charactorJson.clothing,
      'clothing',
      `${charactorJson.clothing}という装備は存在しません`,
    );
  }

  const weapon = getWeapon(charactorJson.weapon);
  if (!weapon) {
    return new DataNotFoundError(charactorJson.weapon, 'weapon', `${charactorJson.weapon}という武器は存在しません`);
  }

  const validateResult = validate(name, race, blessing, clothing, weapon);
  if (validateResult instanceof NotWearableErorr) {
    return validateResult;
  }

  const statuses: Status[] = [];
  for (const status of charactorJson.statuses) {
    const statusObj = toStatus(status);

    if (statusObj instanceof JsonSchemaUnmatchError || statusObj instanceof DataNotFoundError) {
      return statusObj;
    }
    statuses.push(statusObj);
  }

  const someone: Charactor = {
    name,
    race,
    blessing,
    clothing,
    weapon,
    statuses,
    hp: 0 + charactorJson.hp,
    mp: 0 + charactorJson.mp,
    restWt: 0 + charactorJson.restWt,
  };

  if (Object.prototype.hasOwnProperty.call(charactorJson, 'isVisitor')) {
    someone.isVisitor = charactorJson.isVisitor;
  }

  return someone;
};

export type CreateCharactor = (
  name: string,
  race: Race,
  blessing: Blessing,
  clothing: Clothing,
  weapon: Weapon,
) => Charactor | NotWearableErorr | DataNotFoundError;
export const createCharactor: CreateCharactor = (name, race, blessing, clothing, weapon) => {
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
    hp: 0,
    mp: 0,
    restWt: 0,
  };

  const someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHP;
  someone.hp = someonesPhysical.WT;

  return someone;
};

