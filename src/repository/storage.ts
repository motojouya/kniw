
export type CheckNamespace = (namespace: string) => Promise<void>;
export type Save = (namespace: string, objctKey: string, data: object) => Promise<void>;
export type List = (namespace: string) => Promise<string[]>;
export type Get = (namespace: string, objctKey: string) => Promise<object>;
export type Remove = (namespace: string, objctKey: string) => Promise<void>;

export type CreateCheckNamespace = (basePath: string) => CheckNamespace;
export type CreateSave = (basePath: string) => Save;
export type CreateList = (basePath: string) => List;
export type CreateGet = (basePath: string) => Get;
export type CreateRemove = (basePath: string) => Remove;

export type Storage = {
  checkNamespace: CheckNamespace,
  save: Save,
  list: List,
  get: Get,
  remove: Remove,
}

export type CreateStorage = (basePath: string, tables: string[]) => Promise<Storage>;

