import type { CreateSave, CreateGet, CreateRemove, CreateList, CreateStore } from 'src/store/store';
import type { Party } from 'src/domain/party';
import { toParty, toPartyJson, CharactorDuplicationError } from 'src/domain/party';

import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

const NAMESPACE = 'party';

const createSave: CreateSave<Party> = storage => async obj => storage.save(NAMESPACE, obj.name, toPartyJson(obj));

type CreateGetParty = CreateGet<
  Party,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError
>;
const createGet: CreateGetParty = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  if (!result) {
    return null;
  }
  return toParty(result);
};

const createRemove: CreateRemove = storage => async name => storage.remove(NAMESPACE, name);

const createList: CreateList = storage => async () => storage.list(NAMESPACE);

type CreateStoreParty = CreateStore<
  Party,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError
>;
export const createStore: CreateStoreParty = async storage => {
  await storage.checkNamespace(NAMESPACE);
  return {
    save: createSave(storage),
    list: createList(storage),
    get: createGet(storage),
    remove: createRemove(storage),
  };
};
