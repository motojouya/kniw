import type { CreateSave, CreateGet, CreateRemove, CreateList, CreateExportJson, CreateStore } from 'src/store/store';
import type { Battle } from 'src/domain/battle';

import { NotBattlingError } from 'src/domain/battle';
import { CharactorDuplicationError } from 'src/domain/party';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { toBattleJson, toBattle } from 'src/store/schema/battle';

const NAMESPACE = 'battle';

const createSave: CreateSave<Battle> = repository => async obj =>
  repository.save(NAMESPACE, obj.title, toBattleJson(obj));

type CreateGetBattle = CreateGet<
  Battle,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError | NotBattlingError
>;
const createGet: CreateGetBattle = repository => async name => {
  const result = await repository.get(NAMESPACE, name);
  if (!result) {
    return null;
  }
  return toBattle(result);
};

const createRemove: CreateRemove = repository => async name => repository.remove(NAMESPACE, name);

const createList: CreateList = repository => async () => repository.list(NAMESPACE);

const createExportJson: CreateExportJson = repository => async (name, file) =>
  repository.exportJson(NAMESPACE, name, file);

type CreateStoreBattle = CreateStore<
  Battle,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError | NotBattlingError
>;
export const createStore: CreateStoreBattle = async repository => {
  await repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
    exportJson: createExportJson(repository),
  };
};
