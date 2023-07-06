import type { Repository } from 'src/io/file_repository';

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
