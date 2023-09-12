import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';
import type { CharactorForm } from 'src/form/charactor';
import type { Store } from 'src/store/store';

import Ajv, { JSONSchemaType } from 'ajv';
// import ajvErrors from 'ajv-errors'; // FIXME schema.errorMessageというpropertyを使いたかったがうまく動かない

import { DataExistError, JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { NotWearableErorr } from 'src/domain/acquirement';
import { charactorFormSchema, toCharactor, toCharactorForm } from 'src/form/charactor';
import { validate, CharactorDuplicationError } from 'src/domain/party';

// FIXME json-schema-to-tsの導入
// import { FromSchema } from 'json-schema-to-ts';
// type PartyForm = FromSchema<typeof partyFormSchema>;
//
// json-schema-to-tsに変更すると、validationのtype guardも変わる
// import { createValidationCompiler } from 'src/io/json_schema';
// const compile = createValidationCompiler();
// const validateSchema = compile(partyFormSchema);

export type PartyForm = {
  name: string;
  charactors: CharactorForm[];
};

export const partyFormSchema: JSONSchemaType<PartyForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    charactors: {
      type: 'array',
      items: charactorFormSchema,
    },
  },
  required: ['name', 'charactors'],
  //  errorMessage: { minLength: 'username field is required' },
} as const;

export type ToPartyForm = (party: Party) => PartyForm;
export const toPartyForm: ToPartyForm = party => ({
  name: party.name,
  charactors: party.charactors.map(toCharactorForm),
});

export type ToParty = (
  partyForm: any,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toParty: ToParty = partyForm => {
  const ajv = new Ajv({ allErrors: true });
  //  ajvErrors(ajv);
  const validateSchema = ajv.compile<PartyForm>(partyFormSchema);
  if (!validateSchema(partyForm)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'partyのformデータではありません');
  }

  const { name } = partyForm;

  const charactorObjs: Charactor[] = [];
  for (const charactor of partyForm.charactors) {
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
