import type { Charactor } from 'src/domain/charactor'
import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
} from 'src/store/store';
import type { Party } from 'src/domain/party';
import {
  createParty,
  createPartyJson,
} from 'src/domain/party';

import { NotWearableErorr } from 'src/domain/acquirement'
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';

const NAMESPACE = 'party';

const createSave: CreateSave<Party> =
  storage =>
  async obj =>
  (await storage.save(NAMESPACE, obj.name, createPartyJson(obj)));

type CreateGetParty = CreateGet<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;
const createGet: CreateGetParty = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  if (!result) {
    return null;
  }
  return createParty(result);
}

const createRemove: CreateRemove =
  storage =>
  async name =>
  (await storage.remove(NAMESPACE, name));

const createList: CreateList =
  storage =>
  async () =>
  (await storage.list(NAMESPACE));

type CreateStoreParty = CreateStore<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;
export const createStore: CreateStoreParty = storage => {
  storage.checkNamespace(NAMESPACE);
  return {
    save: createSave(storage),
    list: createList(storage),
    get: createGet(storage),
    remove: createRemove(storage),
  }
};

