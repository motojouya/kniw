import type { Charactor, AttachedStatus } from "../model/charactor";
import type { ToModel, ToJson } from "../store_utility/schema";

import { z } from "zod";

import { NotWearableErorr } from "../model/acquirement";
import { DataNotFoundError } from "../store_utility/schema";
import { validate } from "../model/charactor";
import { statusSchema, toStatus, toStatusJson } from "./status";
import { raceRepository, weaponRepository, clothingRepository, blessingRepository } from "../store/acquirement";

export const attachedStatusSchema = z.object({
  status: statusSchema,
  restWt: z.number().int(),
});
export type AttachedStatusSchema = typeof attachedStatusSchema;
export type AttachedStatusJson = z.infer<AttachedStatusSchema>;

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
export type CharactorSchema = typeof charactorSchema;
export type CharactorJson = z.infer<CharactorSchema>;

export const toAttachedStatusJson: ToJson<AttachedStatus, AttachedStatusJson> = (attached) => ({
  status: toStatusJson(attached.status),
  restWt: attached.restWt,
});

export const toCharactorJson: ToJson<Charactor, CharactorJson> = (charactor) => {
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

  if (Object.prototype.hasOwnProperty.call(charactor, "isVisitor")) {
    json.isVisitor = charactor.isVisitor;
  }

  return json;
};

export const toCharactor: ToModel<Charactor, CharactorJson, NotWearableErorr | DataNotFoundError> = (charactorJson) => {
  const { name } = charactorJson;

  const race = raceRepository.get(charactorJson.race);
  if (!race) {
    return new DataNotFoundError(charactorJson.race, "race", `${charactorJson.race}という種族は存在しません`);
  }

  const blessing = blessingRepository.get(charactorJson.blessing);
  if (!blessing) {
    return new DataNotFoundError(
      charactorJson.blessing,
      "blessing",
      `${charactorJson.blessing}という祝福は存在しません`,
    );
  }

  const clothing = clothingRepository.get(charactorJson.clothing);
  if (!clothing) {
    return new DataNotFoundError(
      charactorJson.clothing,
      "clothing",
      `${charactorJson.clothing}という装備は存在しません`,
    );
  }

  const weapon = weaponRepository.get(charactorJson.weapon);
  if (!weapon) {
    return new DataNotFoundError(charactorJson.weapon, "weapon", `${charactorJson.weapon}という武器は存在しません`);
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

  if (Object.prototype.hasOwnProperty.call(charactorJson, "isVisitor")) {
    someone.isVisitor = charactorJson.isVisitor;
  }

  return someone;
};
