import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';

import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { validate, CharactorDuplicationError } from 'src/domain/party';
import { toCharactor, toCharactorJson, charactorSchema } from 'src/store/schema/charactor';

export const partySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    charactors: { type: 'array', items: charactorSchema },
  },
  required: ['name', 'charactors'],
} as const;

export type PartyJson = FromSchema<typeof partySchema>;

export type ToPartyJson = (party: Party) => PartyJson;
export const toPartyJson: ToPartyJson = party => ({
  name: party.name,
  charactors: party.charactors.map(toCharactorJson),
});

export type ToParty = (
  partyJson: any,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toParty: ToParty = partyJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(partySchema);
  if (!validateSchema(partyJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'partyのjsonデータではありません');
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
