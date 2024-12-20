import type { CreateSave, CreateGet, CreateRemove, CreateList, CreateExportJson, CreateImportJson, CreateStore } from '@motojouya/kniw/src/store/store';
import type { Battle } from '@motojouya/kniw/src/domain/battle';

import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { toBattleJson, toBattle, battleSchema } from '@motojouya/kniw/src/store/schema/battle';

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

  const battleJson = parseJson(battleSchema)(result);
  if (battleJson instanceof JsonSchemaUnmatchError) {
    return battleJson;
  }

  return toBattle(battleJson);
};

const createRemove: CreateRemove = repository => async name => repository.remove(NAMESPACE, name);

const createList: CreateList = repository => async () => repository.list(NAMESPACE);

const createExportJson: CreateExportJson<Battle> = repository => async (obj, fileName) =>
  repository.exportJson(toBattleJson(obj), fileName);

type CreateImportJsonBattle = CreateImportJson<
  Battle,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError | NotBattlingError
>;
const createGet: CreateImportJsonBattle = repository => async fileName => {
  const result = await repository.importJson(fileName);
  if (!result) {
    return null;
  }

  const battleJson = parseJson(battleSchema)(result);
  if (battleJson instanceof JsonSchemaUnmatchError) {
    return battleJson;
  }

  return toBattle(battleJson);
};

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
    importJson: createImportJson(repository),
    exportJson: createExportJson(repository),
  };
};
