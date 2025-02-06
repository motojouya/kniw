import type { Party } from "../model/party";
import type { Charactor } from "../model/charactor";
import type { ToModel, ToJson } from "../store_utility/schema";

import { z } from "zod";

import { NotWearableErorr } from "../model/acquirement";
import { DataNotFoundError } from "../store_utility/schema";
import { validate, CharactorDuplicationError } from "../model/party";
import { toCharactor, toCharactorJson, charactorSchema } from "./charactor";

export const partySchema = z.object({
  name: z.string(),
  charactors: z.array(charactorSchema),
});
export type PartySchema = typeof partySchema;
export type PartyJson = z.infer<PartySchema>;

export type ToPartyJson = (party: Party) => PartyJson;
export const toPartyJson: ToJson<Party, PartyJson> = (party) => ({
  name: party.name,
  charactors: party.charactors.map(toCharactorJson),
});

export const toParty: ToModel<Party, PartyJson, NotWearableErorr | DataNotFoundError | CharactorDuplicationError> = (
  partyJson,
) => {
  const { name } = partyJson;

  const charactorObjs: Charactor[] = [];
  for (const charactor of partyJson.charactors) {
    const charactorObj = toCharactor(charactor);
    if (charactorObj instanceof DataNotFoundError || charactorObj instanceof NotWearableErorr) {
      return charactorObj;
    }
    charactorObjs.push(charactorObj);
  }

  const validateResult = validate(name, charactorObjs);
  if (validateResult instanceof CharactorDuplicationError) {
    return validateResult;
  }

  return {
    name,
    charactors: charactorObjs,
  };
};
