import type { Charactor, AttachedStatus } from 'src/domain/charactor';

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';

import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { validate } from 'src/domain/charactor';
import { statusSchema, toStatus, toStatusJson } from 'src/store/schema/status';
import { getRace, getWeapon, getClothing, getBlessing } from 'src/store/acquirement';

export const attachedStatusSchema = {
  type: 'object',
  properties: {
    status: statusSchema,
    restWt: { type: 'integer' },
  },
  required: ['status', 'restWt'],
} as const;

export type AttachedStatusJson = FromSchema<typeof attachedStatusSchema>;

export const charactorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    race: { type: 'string' },
    blessing: { type: 'string' },
    clothing: { type: 'string' },
    weapon: { type: 'string' },
    statuses: {
      type: 'array',
      items: attachedStatusSchema,
    },
    hp: { type: 'integer' },
    mp: { type: 'integer' },
    restWt: { type: 'integer' },
    isVisitor: { type: 'boolean' },
  },
  required: ['name', 'race', 'blessing', 'clothing', 'weapon', 'statuses', 'hp', 'mp', 'restWt'],
} as const;

export type CharactorJson = FromSchema<typeof charactorSchema>;

export type ToAttachedStatusJson = (attached: AttachedStatus) => AttachedStatusJson;
export const toAttachedStatusJson: ToAttachedStatusJson = attached => ({
  status: toStatusJson(attached.status),
  restWt: attached.restWt,
});

export type ToCharactorJson = (charactor: Charactor) => CharactorJson;
export const toCharactorJson: ToCharactorJson = charactor => {
  const json = {
    name: charactor.name,
    race: charactor.race.name,
    blessing: charactor.blessing.name,
    clothing: charactor.clothing.name,
    weapon: charactor.weapon.name,
    statuses: charactor.statuses.map(toAttachedStatusJson),
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

  const statuses: AttachedStatus[] = [];
  for (const attachedStatusJson of charactorJson.statuses) {
    const statusObj = toStatus(attachedStatusJson.status);

    if (statusObj instanceof JsonSchemaUnmatchError || statusObj instanceof DataNotFoundError) {
      return statusObj;
    }

    statuses.push({
      status: statusObj,
      restWt: attachedStatusJson.restWt,
    });
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

