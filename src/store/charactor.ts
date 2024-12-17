import type { CreateSave, CreateGet, CreateRemove, CreateList, CreateStore } from '@motojouya/kniw/src/store/store';
import type { Charactor } from '@motojouya/kniw/src/domain/charactor';

import { toCharactor, toCharactorJson, charactorSchema } from '@motojouya/kniw/src/store/schema/charactor';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { parseJson, JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';

const NAMESPACE = 'charactor';

const createSave: CreateSave<Charactor> = repository => async obj =>
  repository.save(NAMESPACE, obj.name, toCharactorJson(obj));

type CreateGetCharactor = CreateGet<Charactor, NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError>;
const createGet: CreateGetCharactor = repository => async name => {
  const result = await repository.get(NAMESPACE, name);
  if (!result) {
    return null;
  }

  const charactorJson = parseJson(charactorSchema)(result);
  if (charactorJson instanceof JsonSchemaUnmatchError) {
    return charactorJson;
  }

  return toCharactor(charactorJson);
};

const createRemove: CreateRemove = repository => async name => repository.remove(NAMESPACE, name);

const createList: CreateList = repository => async () => repository.list(NAMESPACE);

type CreateStoreCharactor = CreateStore<Charactor, NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError>;
export const createStore: CreateStoreCharactor = async repository => {
  await repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
  };
};
