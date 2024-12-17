import type { Charactor, AttachedStatus } from '@motojouya/kniw/src/domain/charactor';

import { z } from 'zod';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { validate } from '@motojouya/kniw/src/domain/charactor';
import { statusSchema, toStatus, toStatusJson } from '@motojouya/kniw/src/store/schema/status';
import { getRace, getWeapon, getClothing, getBlessing } from '@motojouya/kniw/src/store/acquirement';

export const attachedStatusSchema = z.object({
  status: statusSchema,
  restWt: z.number().int(),
});
export type AttachedStatusJson = z.infer<typeof attachedStatusSchema>;

export const charactorSchema = z.object({
  name: z.string(),
  race: z.string(),
  blessing: z.string(),
  clothing: z.string(),
  weapon: z.string(),
  statuses: z.array(attachedStatusSchema),
  hp: z.number().int(),
  mp: z.number().int(),
  restWt: z.number().int(),
  isVisitor: z.boolean().optional(),
});
export type CharactorJson = z.infer<typeof charactorSchema>;

export type ToAttachedStatusJson = (attached: AttachedStatus) => AttachedStatusJson;
export const toAttachedStatusJson: ToAttachedStatusJson = attached => ({
  status: toStatusJson(attached.status),
  restWt: attached.restWt,
});

export type ToCharactorJson = (charactor: Charactor) => CharactorJson;
export const toCharactorJson: ToCharactorJson = charactor => {
  const json: CharactorJson = {
    name: charactor.name,
    race: charactor.race.name,
    blessing: charactor.blessing.name,
    clothing: charactor.clothing.name,
    weapon: charactor.weapon.name,
    statuses: charactor.statuses.map(toAttachedStatusJson),
    hp: charactor.hp,
    mp: charactor.mp,
    restWt: charactor.restWt,
  };

  if (Object.prototype.hasOwnProperty.call(charactor, 'isVisitor')) {
    json.isVisitor = charactor.isVisitor;
  }

  return json;
};

export type ToCharactor = (
  charactorJson: CharactorJson,
) => Charactor | NotWearableErorr | DataNotFoundError;
export const toCharactor: ToCharactor = charactorJson => {
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
    return new DataNotFoundError(
      charactorJson.weapon,
      'weapon',
      `${charactorJson.weapon}という武器は存在しません`,
    );
  }

  const validateResult = validate(name, race, blessing, clothing, weapon);
  if (validateResult instanceof NotWearableErorr) {
    return validateResult;
  }

  const statuses: AttachedStatus[] = [];
  for (const attachedStatusJson of charactorJson.statuses) {
    const statusObj = toStatus(attachedStatusJson.status);

    if (statusObj instanceof DataNotFoundError) {
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
