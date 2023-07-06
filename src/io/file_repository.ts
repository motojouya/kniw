import fs from 'fs';
import path from 'path';

export type KeyValue = { [name: string]: any };

//TODO データ保存の選択肢が増えたら、型だけ別ファイルに移動
export type CheckNamespace = (namespace: string) => Promise<void>;
export type Save = (namespace: string, objctKey: string, data: KeyValue) => Promise<void>;
export type List = (namespace: string) => Promise<string[]>;
export type Get = (namespace: string, objctKey: string) => Promise<KeyValue | null>;
export type Remove = (namespace: string, objctKey: string) => Promise<void>;

export type CreateCheckNamespace = (basePath: string) => CheckNamespace;
export type CreateSave = (basePath: string) => Save;
export type CreateList = (basePath: string) => List;
export type CreateGet = (basePath: string) => Get;
export type CreateRemove = (basePath: string) => Remove;

export type Repository = {
  checkNamespace: CheckNamespace;
  save: Save;
  list: List;
  get: Get;
  remove: Remove;
};

export type CreateRepository = (basePath: string) => Promise<Repository>;

//以下実装と、ファイル保存の固有の型
const FILE_EXTENSION = '.json';

type IsDataFile = (basePath: string, dirName: string, file: string) => boolean;
const isDataFile: IsDataFile = (basePath, dirName, file) =>
  fs.statSync(path.join(basePath, dirName, file)).isFile() && new RegExp('.*' + FILE_EXTENSION).test(file);

type CreateDirctory = (dirName: string) => Promise<void>;
const createDirctory: CreateDirctory = async dirName => {
  if (!fs.existsSync(dirName)) {
    return await fs.promises.mkdir(dirName);
  }
};

const createCheckNamespace: CreateCheckNamespace = basePath => async namespace =>
  createDirctory(path.join(basePath, namespace));

type ResolvePath = (basePath: string, dirName: string, fileBaseName: string, extension: string) => string;
const resolvePath: ResolvePath = (basePath, dirName, fileBaseName, extension) =>
  path.join(basePath, dirName, fileBaseName + extension);

const createSave: CreateSave = basePath => async (namespace, objctKey, data) =>
  fs.promises.writeFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), JSON.stringify(data));

const createList: CreateList = basePath => async namespace => {
  try {
    const files = await fs.promises.readdir(path.join(basePath, namespace));
    return files.filter(file => isDataFile(basePath, namespace, file)).map(file => path.basename(file, FILE_EXTENSION));
  } catch (e) {
    const error = e as any;
    if (error.code === 'ENOENT') {
      return [];
    } else {
      throw e;
    }
  }
};

const createGet: CreateGet = basePath => async (namespace, objctKey) => {
  try {
    const contents = await fs.promises.readFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), {
      encoding: 'utf8',
    });
    return await JSON.parse(contents);
  } catch (e) {
    const error = e as any;
    if (error.code === 'ENOENT') {
      return null;
    } else {
      throw e;
    }
  }
};

const createRemove: CreateRemove = basePath => async (namespace, objctKey) => {
  try {
    await fs.promises.unlink(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION));
  } catch (e) {
    const error = e as any;
    if (error.code !== 'ENOENT') {
      throw e;
    }
  }
};

export const createRepository: CreateRepository = async basePath => {
  await createDirctory(basePath);
  return {
    checkNamespace: createCheckNamespace(basePath),
    save: createSave(basePath),
    list: createList(basePath),
    get: createGet(basePath),
    remove: createRemove(basePath),
  };
};
