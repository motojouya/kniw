export type Dictionary<T> = { [name: string]: T };
export type MemoryRepository<T> = {
  get: (name: string) => T | null,
  list: string[],
  all: T[],
};

export type CreateMemoryRepository<T> = (items: T[]) => MemoryRepository<T>;
export const createMemoryRepository: CreateMemoryRepository<T> = (items) => ({
  get: (name) => (items as Dictionary<T>)[name],
  list: Object.keys(items as Dictionary<T>),
  all: Object.values(items as Dictionary<T>)
});
