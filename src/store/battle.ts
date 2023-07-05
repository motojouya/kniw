import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
} from 'src/store/store';
import type { Battle } from 'src/domain/battle';

import { CharactorDuplicationError } from 'src/domain/party'
import { NotWearableErorr } from 'src/domain/acquirement'
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';
import {
  createBattleJson,
  createBattle,
} from 'src/domain/battle';

import { parse } from 'date-fns' 
//import ja from 'date-fns/locale/ja'

const NAMESPACE = 'battle';

//TODO Date型がUTCで時間を保持するので、save時にJSTに変換する必要がある。get時のutcへの戻しも
const createSave: CreateSave<Battle> =
  repository =>
  async obj =>
  (await repository.save(NAMESPACE, obj.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), createBattleJson(obj)));

type CreateGetBattle = CreateGet<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;
const createGet: CreateGetBattle = repository => async name => {
  const result = await repository.get(NAMESPACE, name);
  if (!result) {
    return null;
  }
  return createBattle(result);
}

const createRemove: CreateRemove =
  repository =>
  async name =>
  (await repository.remove(NAMESPACE, name));

const createList: CreateList =
  repository =>
  async () =>
  (await repository.list(NAMESPACE));

type CreateStoreBattle = CreateStore<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;
export const createStore: CreateStoreBattle = repository => {
  repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
  }
};

