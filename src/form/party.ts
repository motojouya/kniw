import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Charactor } from '@motojouya/kniw/src/domain/charactor';
import type { CharactorForm } from '@motojouya/kniw/src/form/charactor';
import type { Store } from '@motojouya/kniw/src/store/store';

import { z } from 'zod';

import { DataExistError, JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
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
  partyForm: any,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toParty: ToParty = partyForm => {

  const result = partyFormSchema.safeParse(partyForm);
  if (!result.success) {
    return new JsonSchemaUnmatchError(result.error, 'partyのformデータではありません');
  }

  const partyFormTyped = result.data;

  const { name } = partyFormTyped;

  const charactorObjs: Charactor[] = [];
  for (const charactor of partyFormTyped.charactors) {
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

export type SaveParty = (
  partyForm: any,
) => Promise<
  null | DataNotFoundError | NotWearableErorr | JsonSchemaUnmatchError | CharactorDuplicationError | DataExistError
>;
export type CreateSaveParty = (
  store: Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>,
  checkExists: boolean,
) => SaveParty;
export const saveParty: CreateSaveParty = (store, checkExists) => async partyForm => {
  const party = toParty(partyForm);
  if (
    party instanceof DataNotFoundError ||
    party instanceof NotWearableErorr ||
    party instanceof JsonSchemaUnmatchError ||
    party instanceof CharactorDuplicationError
  ) {
    return party;
  }

  if (checkExists) {
    const partyNames = await store.list();
    if (partyNames.includes(party.name)) {
      return new DataExistError(party.name, 'party', `${party.name}というpartyは既に存在します`);
    }
  }

  await store.save(party);
  return null;
};
