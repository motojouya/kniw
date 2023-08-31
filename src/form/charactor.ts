import type { Charactor } from 'src/domain/charactor';
import type { Store } from 'src/store/store';

import { JSONSchemaType } from "ajv"

import { createValidationCompiler } from 'src/io/json_schema';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { getPhysical } from 'src/domain/charactor';
import { validate } from 'src/domain/charactor';
import { getRace, getWeapon, getClothing, getBlessing } from 'src/store/acquirement';

export type CharactorForm = {
  name: string;
  race: string;
  blessing: string;
  clothing: string;
  weapon: string;
};

export const charactorFormSchema: JSONSchemaType<CharactorForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    race: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    blessing: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    clothing: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    weapon: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
  },
  required: ['name' , 'race', 'blessing', 'clothing', 'weapon'],
  additionalProperties: false,
} as const;

export type ToCharactorForm = (charactor: Charactor) => CharactorForm;
export const toCharactorForm: ToCharactorForm = charactor => ({
  name: charactor.name,
  race: charactor.race.name,
  blessing: charactor.blessing.name,
  clothing: charactor.clothing.name,
  weapon: charactor.weapon.name,
});

export type ToCharactor = (
  charactorForm: any,
) => Charactor | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError;
export const toCharactor: ToCharactor = charactorForm => {
  const compile = createValidationCompiler();
  const validateSchema = compile(charactorFormSchema);
  if (!validateSchema(charactorForm)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'charactorのデータではありません');
  }

  // TODO キャスト無くしたい
  const validCharactor = charactorForm as CharactorForm;

  const { name } = validCharactor;

  const race = getRace(validCharactor.race);
  if (!race) {
    return new DataNotFoundError(validCharactor.race, 'race', `${validCharactor.race}という種族は存在しません`);
  }

  const blessing = getBlessing(validCharactor.blessing);
  if (!blessing) {
    return new DataNotFoundError(
      validCharactor.blessing,
      'blessing',
      `${validCharactor.blessing}という祝福は存在しません`,
    );
  }

  const clothing = getClothing(validCharactor.clothing);
  if (!clothing) {
    return new DataNotFoundError(
      validCharactor.clothing,
      'clothing',
      `${validCharactor.clothing}という装備は存在しません`,
    );
  }

  const weapon = getWeapon(validCharactor.weapon);
  if (!weapon) {
    return new DataNotFoundError(validCharactor.weapon, 'weapon', `${validCharactor.weapon}という武器は存在しません`);
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
    hp: 0,
    mp: 0,
    restWt: 0,
  };

  const someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHP;
  someone.restWt = someonesPhysical.WT;

  return someone;
};

