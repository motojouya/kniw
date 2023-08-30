import type { Party } from 'src/domain/party';
import type { CharactorForm } from 'src/form/charactor';

import { JSONSchemaType } from "ajv"

import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { charactorFormSchema } from 'src/form/charactor';
import { validate, CharactorDuplicationError } from 'src/domain/party';
import { toCharactor, toCharactorForm } from 'src/form/charactor';

// TODO json-schema-to-tsの導入
// import { FromSchema } from 'json-schema-to-ts';
// type PartyForm = FromSchema<typeof partyFormSchema>;

export type PartyForm = {
  name: string;
  charactors: CharactorForm[]
};

export const partyFormSchema: JSONSchemaType<PartyForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    charactors: {
      type: 'array',
      items: charactorFormSchema,
    },
  },
  required: ['name', 'charactors'],
} as const;

export type ToPartyForm = (party: Party) => PartyForm;
export const toPartyForm: ToPartyForm = party => ({
  name: party.name,
  charactors: party.charactors.map(toCharactorForm)
});

export type ToParty = (
  partyForm: any,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toParty: ToParty = partyForm => {
  const compile = createValidationCompiler();
  const validateSchema = compile(partyFormSchema);
  if (!validateSchema(partyForm)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'partyのformデータではありません');
  }

  const { name } = partyJson;

  const charactorObjs: Charactor[] = [];
  for (const charactor of partyJson.charactors) {
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

export type SaveParty = (partyForm: any) => Promise<null | DataNotFoundError | NotWearableErorr | JsonSchemaUnmatchError | CharactorDuplicationError | DataExistError>;
export type CreateSaveParty = (store: Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>, checkExists: boolean) => SaveParty;
export const saveParty: CreateSaveParty = (store, checkExists) => async (partyForm) => {

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
      return new DataExistError(party.name, 'party', `${name}というpartyは既に存在します`);
    }
  }

  store.save(party);
  return null;
}

