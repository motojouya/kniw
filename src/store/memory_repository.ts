import type { Repository } from '@motojouya/kniw/src/io/repository';
import { CopyFailError } from '@motojouya/kniw/src/io/repository';

export type Save<T> = (obj: T) => Promise<void>;
export type Get<T, E> = (name: string) => Promise<T | E | null>;
export type Remove = (name: string) => Promise<void>;
export type List = () => Promise<string[]>;
export type ImportJson<T, E> = (fileName: string) => Promise<T | E | null>;
export type ExportJson<T> = (obj: T, fileName: string) => Promise<CopyFailError | null>;

export type CreateSave<T> = (repository: Repository) => Save<T>;
export type CreateGet<T, E> = (repository: Repository) => Get<T, E>;
export type CreateRemove = (repository: Repository) => Remove;
export type CreateList = (repository: Repository) => List;
export type CreateImportJson<T, E> = (repository: Repository) => ImportJson<T, E>;
export type CreateExportJson<T> = (repository: Repository) => ExportJson<T>;

export type Store<T, E> = {
  save: Save<T>;
  list: List;
  get: Get<T, E>;
  remove: Remove;
  importJson: ImportJson<T, E>;
  exportJson: ExportJson<T>;
};
export type CreateStore<T, E> = (repository: Repository) => Promise<Store<T, E>>;

export function parseJson<S extends z.ZodTypeAny>(schema: S): (json: unknown) => z.infer<S> | JsonSchemaUnmatchError {
  return function (json) {

    const result = schema.safeParse(json);
    if (result.success) {
      return result.data;
    } else {
      return new JsonSchemaUnmatchError(result.error, '想定されたjson schemaのデータではありません');
    }
  };
}

export class JsonSchemaUnmatchError {
  constructor(
    readonly error: any,
    readonly message: string,
  ) {}
}

export class DataNotFoundError {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly message: string,
  ) {}
}

export class DataExistError {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly message: string,
  ) {}
}

// TODO on memoryなやつの実装。こっちに換えたい。
// type Dictionary<T> = { [name: string]: T };
// type Store<T> = {
//   get: (name: string) => T | null,
//   list: string[],
//   all: T[],
// };
// type CreateStore<T> = (items: T[]) => Store<T>;
// const createStore: CreateStore<T> = <T>(items) => ({
//   get: (name) => (items as Dictionary<T>)[name],
//   list: Object.keys(items as Dictionary<T>),
//   all: Object.values(items as Dictionary<T>)
// });

// TODO 以下にも書き換えて差し替えたい。 working

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

type CreateImportJson<S, M, J, E> = <S, M, J, E>(schema: S, toModel: ToModel<M, J, E>) => (repository) => ImportJson;
const createImportJson: CreateImportJson = (schema, toModel) => (repository) => async (fileName) => {
  const result = await repository.importJson(fileName);
  if (!result) {
    return null;
  }

  const json = parseJson(schema)(result);
  if (json instanceof JsonSchemaUnmatchError) {
    return json;
  }

  return toModel(json);
};

type ToModel<M, J, E> = (json: J) => M | E;
type ToJson<M, J> = (model: M) => J;
export const createStore: CreateStore<S, M, J, E> = (namespace: string, schema: S, toModel: ToModel<M, J, E>, toJson: ToJson<M, J>) => async (repository) => {
  await repository.checkNamespace(namespace);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
    importJson: createImportJson(repository),
    exportJson: createExportJson(repository),
  };
};
