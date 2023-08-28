import type {
  KeyValue,
  CheckNamespace,
  Save,
  List,
  Get,
  Remove,
  Copy,
  CreateCheckNamespace,
  CreateSave,
  CreateList,
  CreateGet,
  CreateRemove,
  CreateCopy,
  Repository,
  CreateRepository,
} from 'src/io/repository';
import fs from 'fs';
import path from 'path';
import Dexie from 'dexie';
import type { CopyFailError } from 'src/io/repository';

import { PartyJson } from 'src/domain/party';
import { BattleJson } from 'src/domain/battle';

class KniwDB extends Dexie {
  party: Dexie.Table<PartyJson, string>;
  battle: Dexie.Table<BattleJson, string>;
  constructor () {
    super('KniwDB');
    this.version(1).stores({
      patry: 'name',
      battle: 'title',
    });
  }
}

var db = new Dexie("MyAppDatabase");
db.version(1).stores({contacts: 'id, first, last'});
db.contacts.put({first: "First name", last: "Last name"}); // Fails to compile


const createCheckNamespace: CreateCheckNamespace = basePath => async namespace => {};

const createSave: CreateSave = basePath => async (namespace, objctKey, data) =>
  fs.promises.writeFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), JSON.stringify(data));

const createList: CreateList = basePath => async namespace => {
  try {
    const files = await fs.promises.readdir(path.join(basePath, namespace));
    return files.filter(file => isDataFile(basePath, namespace, file)).map(file => path.basename(file, FILE_EXTENSION));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const error = e as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(contents);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const error = e as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const error = e as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code !== 'ENOENT') {
      throw e;
    }
  }
};

// FIXME エラーが粗いので細かくしたい。参照書き込み権限とか、ディレクトリの存在有無とか
// ただし、fsのエラーメッセージが一緒なら意味がない
const createCopy: CreateCopy = basePath => async (namespace, objctKey, fileName) => {
  try {
    await fs.promises.copyFile(
      resolvePath(basePath, namespace, objctKey, FILE_EXTENSION),
      fileName,
      fs.constants.COPYFILE_EXCL,
    );
    return null;
  } catch (e) {
    return new CopyFailError(fileName, e, `${objctKey}を${fileName}へコピーに失敗しました`);
  }
};

export type ReadJson = (fileName: string) => Promise<object | null>;
export const readJson: ReadJson = async fileName => {
  try {
    const contents = await fs.promises.readFile(fileName, {
      encoding: 'utf8',
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(contents);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const error = e as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 'ENOENT') {
      return null;
    } else {
      throw e;
    }
  }
};

export const createRepository: CreateRepository = async basePath => {
  return {
    checkNamespace: createCheckNamespace(basePath),
    save: createSave(basePath),
    list: createList(basePath),
    get: createGet(basePath),
    remove: createRemove(basePath),
    copy: createCopy(basePath),
  };
};
