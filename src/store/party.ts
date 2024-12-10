import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateExportJson,
  CreateStore,
} from '@motojouya/kniw/src/store/store';
import type { Party } from '@motojouya/kniw/src/domain/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toParty, toPartyJson } from '@motojouya/kniw/src/store/schema/party';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';

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

const createExportJson: CreateExportJson = storage => async (name, file) => storage.exportJson(NAMESPACE, name, file);

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
    exportJson: createExportJson(storage),
  };
};
