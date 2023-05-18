import { Charactor, getPhysical } from 'src/model/charactor'
import {
  CreateSave<T>
  CreateGet<T>
  CreateRemove
  CreateList
  CreateStore<T>
} from 'src/mode/store';

const NAMESPACE = 'party';

export type Party = {
  name: string,
  charactors: Charactor[],
}

export type CreateParty = (name: string, charactors: Charactor[]) => Party | CharactorDuplicationErorr
export const createParty: CreateParty = (name, charactors) => {

  const validateResult = validate(name, charactors);
  if (isCharactorDuplicationErorr(validateResult)) {
    return validateResult;
  }

  return {
    name,
    charactors,
  }
};

export type CharactorDuplicationErorr = {
  message: string,
};

export function isCharactorDuplicationErorr(obj: any): obj is CharactorDuplicationErorr {
  return !!obj && typeof obj === 'object' && 'message' in obj;
}

type Validate = (name: string, charactors: Charactor[]) => CharactorDuplicationErorr | null;
const validate: Validate = (name, charactors) => {

  const nameCountMap = charactors.reduce((acc, charactor) => {
    const nameCount = acc[charactor.name];
    if (!nameCount) {
      acc[charactor.name] = 0;
    }
    acc[charactor.name] += 1;

    return acc;
  }, {});

  for (let name in nameCountMap) {
    if (nameCountMap[name] > 1) {
      return { message: 'Partyに同じ名前のキャラクターが存在します' };
    }
  }

  return null;
};

const createSave: CreateSave<Party> =
  storage =>
  async obj =>
  (await storage.save(NAMESPACE, obj.name, obj));

const createGet: CreateGet<Party> = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  const party = createParty(...result);
  if (isCharactorDuplicationErorr(party)) {
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

export const createStorage: CreateStore<Party> = storage => {
  storage.checkNamespace(NAMESPACE);
  return {
    save: createSave(storage),
    list: createList(storage),
    get: createGet(storage),
    remove: createRemove(storage),
  }
};

