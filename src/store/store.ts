import type { Repository } from '@motojouya/kniw/src/io/repository';
import { CopyFailError } from '@motojouya/kniw/src/io/repository';

export type Save<T> = (obj: T) => Promise<void>;
export type Get<T, E> = (name: string) => Promise<T | E | null>;
export type Remove = (name: string) => Promise<void>;
export type List = () => Promise<string[]>;

export type CreateSave<T> = (repository: Repository) => Save<T>;
export type CreateGet<T, E> = (repository: Repository) => Get<T, E>;
export type CreateRemove = (repository: Repository) => Remove;
export type CreateList = (repository: Repository) => List;

export type Store<T, E> = {
  save: Save<T>;
  list: List;
  get: Get<T, E>;
  remove: Remove;
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
