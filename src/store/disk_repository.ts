import type { Database } from '@motojouya/kniw/src/io/database';
import type { ToModel, ToJson } from '@motojouya/kniw/src/store/schema/schema';
import { CopyFailError } from '@motojouya/kniw/src/io/database';
import { parseJson, JsonSchemaUnmatchError } from '@motojouya/kniw/src/store/schema/schema';

export type Save<M> = (obj: M) => Promise<void>;
export type Get<M, E> = (name: string) => Promise<M | E | JsonSchemaUnmatchError | null>;
export type Remove = (name: string) => Promise<void>;
export type List = () => Promise<string[]>;
export type ImportJson<M, E> = (fileName: string) => Promise<M | E | JsonSchemaUnmatchError | null>;
export type ExportJson<M> = (obj: M, fileName: string) => Promise<CopyFailError | null>;

export type Repository<M, E> = {
  save: Save<M>;
  list: List;
  get: Get<M, E | JsonSchemaUnmatchError>;
  remove: Remove;
  importJson: ImportJson<M, E | JsonSchemaUnmatchError>;
  exportJson: ExportJson<M>;
};

type CreateSave<M, J> = <M, J>(namespace: string, key: string, toJson: ToJson<M, J>) => (database: Database) => Save<M>
const createSave: CreateSave<Battle> = (namespace, key, toJson) => (database) => async obj =>
  database.save(namespace, obj[key], toJson(obj));

type CreateList = (namespace: string) => (database: Database) => List;
const createList: CreateList = (namespace) => database => async () => repository.list(namespace);

type CreateGet<S, M, J, E> = <S, M, J, E>(namespace: string, schema: S, toModel: ToModel<M, J, E>) => (database: Database) => Get<M, E | JsonSchemaUnmatchError>;
const createGet: CreateGet<S, M, J, E> = (namespace, schema, toModel) => (database) => async name => {
  const result = await database.get(namespace, name);
  if (!result) {
    return null;
  }

  const json = parseJson(schema)(result);
  if (json instanceof JsonSchemaUnmatchError) {
    return json;
  }

  return toModel(json);
};

type CreateRemove = (namespace: string) => (database: Database) => Remove;
const createRemove: CreateRemove = (namespace: string) => (database) => async name => repository.remove(namespace, name);

type CreateImportJson<S, M, J, E> = <S, M, J, E>(schema: S, toModel: ToModel<M, J, E>) => (database: Database) => ImportJson<M, E | JsonSchemaUnmatchError>;
const createImportJson: CreateImportJson = (schema, toModel) => (database) => async (fileName) => {
  const result = await database.importJson(fileName);
  if (!result) {
    return null;
  }

  const json = parseJson(schema)(result);
  if (json instanceof JsonSchemaUnmatchError) {
    return json;
  }

  return toModel(json);
};

type CreateExportJson<M, J> = <M, J>(schema: S, toJson: ToJson<M, J>) => (database: Database) => ExportJson<M>
const createSave: CreateExportJson<Battle> = (toJson) => (database) => async (obj, fileName) =>
  database.exportJson(toJson(obj), fileName);

export type CreateRepository<S, M, J, E> = (namespace: string, schema: S, toModel: ToModel<M, J, E>, toJson: ToJson<M, J>, key: string) => (database: Database) => Promise<Repository<M, E>>;
export const createRepository: createRepository<S, M, J, E> = (namespace, schema, toModel, toJson, key) => async (database) => {
  await database.checkNamespace(namespace);
  return {
    save: createSave(namespace, key, toJson)(database),
    list: createList(namespace)(database),
    get: createGet(namespace, schema, toModel)(database),
    remove: createRemove(namespace)(database),
    importJson: createImportJson(schema, toModel)(database),
    exportJson: createExportJson(schema, toJson)(database),
  };
};
