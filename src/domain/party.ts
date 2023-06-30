import type { Charactor } from 'src/domain/charactor'
import {
  createCharactor,
  getPhysical,
  createCharactorJson,
  charactorSchema,
  AcquirementNotFoundError,
} from 'src/domain/charactor'
import { NotWearableErorr } from 'src/domain/acquirement'
import { JsonSchemaUnmatchError } from 'src/store/store';

import { FromSchema } from "json-schema-to-ts";
import { createValidationCompiler } from 'src/io/json_schema';

export type Party = {
  name: string,
  charactors: Charactor[],
}

export const partySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    charactors: { type: "array" , items: charactorSchema },
  },
  required: ["name", "charactors"],
} as const;

export type PartyJson = FromSchema<typeof partySchema>;

export class CharactorDuplicationError {
  constructor(
    public name: string,
    public message: string,
  ) {}
}

export type CreatePartyJson = (party: Party) => PartyJson;
export const createPartyJson: CreatePartyJson = party => ({
  name: party.name,
  charactors: party.charactors.map(createCharactorJson),
});

type Validate = (name: string, charactors: Charactor[]) => CharactorDuplicationError | null;
const validate: Validate = (name, charactors) => {

  const nameCountMap = charactors.reduce((acc, charactor) => {
    const nameCount = acc[charactor.name];
    if (!nameCount) {
      acc[charactor.name] = 0;
    }
    acc[charactor.name] += 1;

    return acc;
  }, ({} as { [name: string]: number }));

  for (let name in nameCountMap) {
    if (nameCountMap[name] > 1) {
      return new CharactorDuplicationError(name, 'Partyに同じ名前のキャラクターが存在します');
    }
  }

  return null;
};

export type CreateParty = (partyJson: any) => Party | NotWearableErorr | AcquirementNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const createParty: CreateParty = partyJson => {

  const compile = createValidationCompiler();
  const validateSchema = compile(partySchema)
  if (!validateSchema(partyJson)) {
    // @ts-ignore
    const errors = validateSchema.errors;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'partyのjsonデータではありません');
  }

  const name = partyJson.name;

  const charactorObjs: Charactor[] = [];
  for (let charactor of partyJson.charactors) {
    const charactorObj = createCharactor(charactor);
    if (charactorObj instanceof AcquirementNotFoundError
     || charactorObj instanceof NotWearableErorr
     || charactorObj instanceof JsonSchemaUnmatchError
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
  }
};

