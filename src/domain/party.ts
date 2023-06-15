import { Charactor, createCharactor, getPhysical } from 'src/model/charactor'
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

export type CreateParty = (name: string, charactors: { name: string, race: string, blessing: string, clothing: string, weapon: string }[]) => Party | CharactorDuplicationError
export const createParty: CreateParty = (name, charactors) => {

  const charactorObjs = charactors.map(charactor => createCharactor(charactor.name, charactor.race, charactor.blessing, charactor.clothing, charactor.weapon));
  const validateResult = validate(name, charactorObjs);
  if (isCharactorDuplicationError(validateResult)) {
    return validateResult;
  }

  return {
    name,
    charactors,
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
  }, {});

  for (let name in nameCountMap) {
    if (nameCountMap[name] > 1) {
      return { message: 'Partyに同じ名前のキャラクターが存在します' };
    }
  }

  return null;
};

const createSave: CreateSave<Party> = storage => async obj => {
  const name = obj.name;
  const charactors = obj.charactors.map(charactor => ({
    name: charactor.name,
    race: charactor.race.name,
    blessing: charactor.blessing.name,
    clothing: charactor.clothing.name,
    weapon: charactor.weapon.name,
  }));
  (await storage.save(NAMESPACE, name, { name, charactors }));
}

const createGet: CreateGet<Party> = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  const party = createParty(...result);
  if (isCharactorDuplicationError(party)) {
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

