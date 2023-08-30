import type {
  KeyValue,
  CheckNamespace,
  Save,
  List,
  Get,
  Remove,
  Copy,
  Repository,
} from 'src/io/repository';
import fs from 'fs';
import path from 'path';
import Dexie from 'dexie';
import type { CopyFailError } from 'src/io/repository';

import { PartyJson } from 'src/store/party';
import { BattleJson } from 'src/store/battle';

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

// type GetTable = (db: Dexie, tableName: string) => Dexie.Table<PartyJson, string> | Dexie.Table<BattleJson, string>;
type GetTable = (db: Dexie, tableName: string) => Dexie.Table;
const getTable: GetTable = (db, tableName) => {
  if (tableName === 'party') {
    return db.party;
  }
  if (tableName === 'battle') {
    return db.battle;
  }
  throw new Error('no such tables');
};

type CreateDB = () => Dexie;
const createDB: CreateDB = () => new Dexie('KniwDB');

type CreateSave = (db: Dexie) => Save;
const createSave: CreateSave = db => async (namespace, objctKey, data) => {
  const table = createDB(db, namespace);
  await table.put(data);
}

type CreateList = (db: Dexie) => List;
const createList: CreateList = db => async namespace => {
  const table = createDB(db, namespace);
  const list = await table.primaryKeys();
  return list.map(item => '' + item);
};

type CreateGet = (db: Dexie) => Get;
const createGet: CreateGet = db => async (namespace, objctKey) => {
  const table = createDB(db, namespace);
  return await table.get(objctKey);
};

type CreateRemove = (db: Dexie) => Remove;
const createRemove: CreateRemove = db => async (namespace, objctKey) => {
  const table = createDB(db, namespace);
  await table.delete(data);
};

// でもwindow自体は引数というよりcontextなので、このタイミングで渡ってくるものではないか
// TODO exportという関数名に変えて、型を付けたい。
type CreateCopy = (db: Dexie) => Copy;
const createCopy: CreateCopy = db => async (namespace, objctKey, fileName) => {
  const table = createDB(db, namespace);
  const json =  await table.get(objctKey);

  const newHandle = await window.showSaveFilePicker();
  const writableStream = await newHandle.createWritable();
  await writableStream.write(JSON.stringify(json));
  await writableStream.close();
};

const pickerOpts = {
  types: [
    {
      description: "JSON",
      accept: {
        "application/json": [".json"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

// TODO importという関数名に変えて、型を付けたい。
export type ReadJson = () => Promise<object | null>;
export const readJson: ReadJson = async () => {
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const fileData = await fileHandle.getFile();
  return JSON.parse(fileData);
};

export type CreateRepository = () => Promise<Repository>;
export const createRepository: CreateRepository = async () => {
  const db = createDB();
  return {
    checkNamespace: async (namespace) => {},
    save: createSave(db),
    list: createList(db),
    get: createGet(db),
    remove: createRemove(db),
    copy: createCopy(db),
  };
};
