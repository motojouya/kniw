import type { Charactor } from 'src/domain/charactor';
import type { Store } from 'src/store/store';

import Ajv, { JSONSchemaType } from "ajv"

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
  const ajv = new Ajv();
  const validateSchema = ajv.compile<CharactorForm>(charactorFormSchema);
  if (!validateSchema(charactorForm)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'charactorのデータではありません');
  }

  const { name } = charactorForm;

  const race = getRace(charactorForm.race);
  if (!race) {
    return new DataNotFoundError(charactorForm.race, 'race', `${charactorForm.race}という種族は存在しません`);
  }

  const blessing = getBlessing(charactorForm.blessing);
  if (!blessing) {
    return new DataNotFoundError(
      charactorForm.blessing,
      'blessing',
      `${charactorForm.blessing}という祝福は存在しません`,
    );
  }

  const clothing = getClothing(charactorForm.clothing);
  if (!clothing) {
    return new DataNotFoundError(
      charactorForm.clothing,
      'clothing',
      `${charactorForm.clothing}という装備は存在しません`,
    );
  }

  const weapon = getWeapon(charactorForm.weapon);
  if (!weapon) {
    return new DataNotFoundError(charactorForm.weapon, 'weapon', `${charactorForm.weapon}という武器は存在しません`);
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

