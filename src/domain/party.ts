import type { Charactor, AcquirementNotFoundError } from 'src/domain/charactor'
import {
  createCharactor,
  getPhysical,
  isAcquirementNotFoundError,
  createCharactorJson,
  charactorSchema,
} from 'src/domain/charactor'
import type { NotWearableErorr } from 'src/domain/acquirement'
import { isNotWearableErorr } from 'src/domain/acquirement'
import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
  JsonSchemaUnmatchError,
} from 'src/domain/store';
import { isJsonSchemaUnmatchError } from 'src/domain/store';

import { FromSchema } from "json-schema-to-ts";
import Ajv from "ajv"

const ajv = new Ajv();

const NAMESPACE = 'party';

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

export type CreateParty = (partyJson: any) => Party | NotWearableErorr | AcquirementNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const createParty: CreateParty = partyJson => {

  const validateSchema = ajv.compile(partySchema)
  const valid = validateSchema(partyJson)
  if (!valid) {
    console.debug(validateSchema.errors);
    return {
      error: validateSchema.errors,
      message: 'partyのjsonデータではありません',
    };
  }
  const validParty = partyJson as PartyJson;

  const name = validParty.name;

  const charactorObjs: Charactor[] = [];
  for (let charactor of validParty.charactors) {
    const charactorObj = createCharactor(charactor);
    if (isAcquirementNotFoundError(charactorObj)
     || isNotWearableErorr(charactorObj)
     || isJsonSchemaUnmatchError(charactorObj)
    ) {
      return charactorObj;
    }
    charactorObjs.push(charactorObj);
  }

  const validateResult = validate(name, charactorObjs);
  if (isCharactorDuplicationError(validateResult)) {
    return validateResult;
  }

  return {
    name,
    charactors: charactorObjs,
  }
};

export type CharactorDuplicationError = {
  message: string,
};

export function isCharactorDuplicationError(obj: any): obj is CharactorDuplicationError {
  return !!obj && typeof obj === 'object' && 'message' in obj;
}

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
      return { message: 'Partyに同じ名前のキャラクターが存在します' };
    }
  }

  return null;
};

export type CreatePartyJson = (party: Party) => PartyJson;
export const createPartyJson: CreatePartyJson = party => ({
  name: party.name,
  charactors: party.charactors.map(createCharactorJson),
});

const createSave: CreateSave<Party> =
  storage =>
  async obj =>
  (await storage.save(NAMESPACE, obj.name, createPartyJson(obj)));

const createGet: CreateGet<Party> = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  if (!result) {
    return null;
  }

  const party = createParty(result);

  if (isNotWearableErorr(party)
   || isAcquirementNotFoundError(party)
   || isCharactorDuplicationError(party)
   || isJsonSchemaUnmatchError(party)
  ) {
    return Promise.reject(party);
  }
  return party;
}

const createRemove: CreateRemove =
  storage =>
  async name =>
  (await storage.remove(NAMESPACE, name));

const createList: CreateList =
  storage =>
  async () =>
  (await storage.list(NAMESPACE));

export const createStore: CreateStore<Party> = storage => {
  storage.checkNamespace(NAMESPACE);
  return {
    save: createSave(storage),
    list: createList(storage),
    get: createGet(storage),
    remove: createRemove(storage),
  }
};

