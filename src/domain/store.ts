import type { Repository } from 'src/io/file_repository';

export type Save<T> = (obj: T) => Promise<void>
export type Get<T> = (name: string) => Promise<T | null>
export type Remove = (name: string) => Promise<void>
export type List = () => Promise<string[]>

export type CreateSave<T> = (repository: Repository) => Save<T>
export type CreateGet<T> = (repository: Repository) => Get<T>
export type CreateRemove = (repository: Repository) => Remove
export type CreateList = (repository: Repository) => List

export type Store<T> = {
  save: Save<T>,
  list: List,
  get: Get<T>,
  remove: Remove,
}
export type CreateStore<T> = (repository: Repository) => Store<T>

