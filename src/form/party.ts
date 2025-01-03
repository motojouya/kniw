import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Charactor } from '@motojouya/kniw/src/domain/charactor';

import { z } from 'zod';

import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { charactorFormSchema, toCharactor, toCharactorForm } from '@motojouya/kniw/src/form/charactor';
import { validate, CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';

export const partyFormSchema = z.object({
  name: z.string().min(1),
  charactors: z.array(charactorFormSchema),
});
export type PartyForm = z.infer<typeof partyFormSchema>;

export type ToPartyForm = (party: Party) => PartyForm;
export const toPartyForm: ToPartyForm = party => ({
  name: party.name,
  charactors: party.charactors.map(toCharactorForm),
});

export type ToParty = (
  partyForm: PartyForm,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError;
export const toParty: ToParty = partyForm => {
  const { name } = partyForm;

  const charactorObjs: Charactor[] = [];
  for (const charactor of partyForm.charactors) {
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
