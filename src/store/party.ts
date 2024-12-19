import type { CreateSave, CreateGet, CreateRemove, CreateList, CreateExportJson, CreateImportJson, CreateStore } from '@motojouya/kniw/src/store/store';
import type { Party } from '@motojouya/kniw/src/domain/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toParty, toPartyJson, partySchema } from '@motojouya/kniw/src/store/schema/party';

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

  const partyJson = parseJson(partySchema)(result);
  if (partyJson instanceof JsonSchemaUnmatchError) {
    return partyJson;
  }

  return toParty(partyJson);
};

const createRemove: CreateRemove = storage => async name => storage.remove(NAMESPACE, name);

const createList: CreateList = storage => async () => storage.list(NAMESPACE);

const createExportJson: CreateExportJson<Party> = storage => async (obj, fileName) => storage.exportJson(toPartyJson(obj), fileName);

type CreateImportJsonParty = CreateImportJson<
  Party,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError
>;
const createImportJson: CreateImportJsonParty = storage => async fileName => {
  const result = await storage.importJson(fileName);
  if (!result) {
    return null;
  }

  const partyJson = parseJson(partySchema)(result);
  if (partyJson instanceof JsonSchemaUnmatchError) {
    return partyJson;
  }

  return toParty(partyJson);
};

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
    importJson: createImportJson(storage),
    exportJson: createExportJson(storage),
  };
};
