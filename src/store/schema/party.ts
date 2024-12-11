import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Charactor } from '@motojouya/kniw/src/domain/charactor';

import { z } from "zod";

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { validate, CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toCharactor, toCharactorJson, charactorSchema } from '@motojouya/kniw/src/store/schema/charactor';

export const partySchema = z.object({
  name: z.string(),
  charactors: z.array(charactorSchema),
});
export type PartyJson = z.infer<typeof partySchema>;

export type ToPartyJson = (party: Party) => PartyJson;
export const toPartyJson: ToPartyJson = party => ({
  name: party.name,
  charactors: party.charactors.map(toCharactorJson),
});

export type ToParty = (
  partyJson: any,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toParty: ToParty = partyJson => {

  const result = partySchema.safeParse(partyJson);
  if (!result.success) {
    return new JsonSchemaUnmatchError(result.error, 'partyのjsonデータではありません');
  }

  const { name } = result.data;

  const charactorObjs: Charactor[] = [];
  for (const charactor of result.data.charactors) {
    const charactorObj = toCharactor(charactor);
    if (
      charactorObj instanceof DataNotFoundError ||
      charactorObj instanceof NotWearableErorr ||
      charactorObj instanceof JsonSchemaUnmatchError
    ) {
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
