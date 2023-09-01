import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';
import type { PartyForm } from 'src/form/party';
import type { CharactorForm } from 'src/form/charactor';
import type { Store } from 'src/store/store';

import Ajv, { JSONSchemaType } from 'ajv';

import { DataExistError, JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { NotWearableErorr } from 'src/domain/acquirement';
import { charactorFormSchema, toCharactor, toCharactorForm } from 'src/form/charactor';
import { validate, CharactorDuplicationError } from 'src/domain/party';

// TODO
// battle始まりは以下だが、react hook formで管理するのはtitleだけ。ほかはfile読み込みなので型チェックとかは独自実装
// - title: party
// - home party
// - visitor party
//
// アクション選択は以下
// - アクター: { 名前, homeOrVisitor }
// - スキル: string
// - 受け手: { 名前, homeOrVisitor }[]
// 
// { 名前, homeOrVisitor }を一つのselect boxで選びたいんだけど、stringのvalueを扱うので、JSON{parse,stringify}がいる
// あとreact hook formで扱いづらいのでformの型としては、{ 名前, homeOrVisitor } -> stringとするかも

export type BattlingCharactorForm = {
  name: string;
  home: boolean;
};

export type DoSkillForm = BattlingCharactorForm & {
  skillName: string;
  receivers: BattlingCharactor[];
};

export const partyFormSchema: JSONSchemaType<BattlingCharactorForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    home: { type: 'boolen' },
  },
  required: ['name', 'home'],
} as const;

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
  charactors: party.charactors.map(toCharactorForm),
});

export type ToParty = (
  partyForm: any,
) => Party | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toParty: ToParty = partyForm => {
  const ajv = new Ajv();
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
