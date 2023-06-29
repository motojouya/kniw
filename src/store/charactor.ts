import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
} from 'src/store/store';
import type { Charactor } from 'src/domain/charactor';

import {
  createCharactor,
  createCharactorJson,
  AcquirementNotFoundError,
} from 'src/domain/charactor';
import {
  NotWearableErorr,
  isNotWearableErorr,
} from 'src/domain/acquirement'
import { JsonSchemaUnmatchError } from 'src/domain/store';

const NAMESPACE = 'charactor';

const createSave: CreateSave<Charactor> =
  repository =>
  async obj =>
  (await repository.save(NAMESPACE, obj.name, createCharactorJson(obj)));


type CreateGetCharactor = CreateGet<Charactor, NotWearableErorr | AcquirementNotFoundError | JsonSchemaUnmatchError>;
const createGet: CreateGetCharactor = repository => async name => {
  const result = await repository.get(NAMESPACE, name);
  if (!result) {
    return null;
  }
  return createCharactor(result);
}

const createRemove: CreateRemove =
  repository =>
  async name =>
  (await repository.remove(NAMESPACE, name));

const createList: CreateList =
  repository =>
  async () =>
  (await repository.list(NAMESPACE));

type CreateStoreCharactor = CreateStore<Charactor, NotWearableErorr | AcquirementNotFoundError | JsonSchemaUnmatchError>;
export const createStore: CreateStoreCharactor = repository => {
  repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
  }
};

