export type Save<T> = (obj: T) => Promise<void>
export type Get<T> = (name: string) => Promise<T>
export type Remove = (name: string) => Promise<void>
export type List = () => Promise<string[]>

export type CreateSave<T> = (storage: Storage) => Save<T>
export type CreateGet<T> = (storage: Storage) => Get<T>
export type CreateRemove = (storage: Storage) => List
export type CreateList = (storage: Storage) => Remove

export type Store<T> = {
  save: Save<T>,
  list: List,
  get: Get<T>,
  remove: Remove,
}
export type CreateStore<T> = (storage: Storage) => Store<T>

