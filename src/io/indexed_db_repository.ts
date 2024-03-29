import type { Save, List, Get, Remove, ExportJson, Repository } from 'src/io/repository';

import Dexie from 'dexie';

import { CopyFailError } from 'src/io/repository';
import { PartyJson } from 'src/store/schema/party';
import { BattleJson } from 'src/store/schema/battle';

class KniwDB extends Dexie {
  party!: Dexie.Table<PartyJson, string>;

  battle!: Dexie.Table<BattleJson, string>;

  constructor() {
    super('KniwDB');
    this.version(1).stores({
      party: 'name',
      battle: 'title',
    });
  }
}

// type GetTable = (db: Dexie, tableName: string) => Dexie.Table<PartyJson, string> | Dexie.Table<BattleJson, string>;
type GetTable = (db: KniwDB, tableName: string) => Dexie.Table;
const getTable: GetTable = (db, tableName) => {
  if (tableName === 'party') {
    return db.party;
  }
  if (tableName === 'battle') {
    return db.battle;
  }
  throw new Error('no such tables');
};

type CreateDB = () => KniwDB;
const createDB: CreateDB = () => new KniwDB();

type CreateSave = (table: KniwDB) => Save;
const createSave: CreateSave = db => async (namespace, objctKey, data) => {
  const table = getTable(db, namespace);
  await table.put(data);
};

type CreateList = (db: KniwDB) => List;
const createList: CreateList = db => async namespace => {
  const table = getTable(db, namespace);
  const list = await table.toCollection().primaryKeys();
  return list.map(item => String(item));
};

type CreateGet = (db: KniwDB) => Get;
const createGet: CreateGet = db => async (namespace, objctKey) => {
  const table = getTable(db, namespace);
  return table.get(objctKey);
};

type CreateRemove = (db: KniwDB) => Remove;
const createRemove: CreateRemove = db => async (namespace, objctKey) => {
  const table = getTable(db, namespace);
  await table.delete(objctKey);
};

type CreateExportJson = (db: KniwDB) => ExportJson;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createExportJson: CreateExportJson = db => async (namespace, objctKey, fileName) => {
  const table = getTable(db, namespace);
  const json = (await table.get(objctKey)) as object | null;
  if (!json) {
    return new CopyFailError(objctKey, null, `${objctKey}は存在しません`);
  }

  const newHandle = await window.showSaveFilePicker();
  const writableStream = await newHandle.createWritable();
  await writableStream.write(JSON.stringify(json));
  await writableStream.close();
  return null;
};

const pickerOpts = {
  types: [
    {
      description: 'JSON',
      accept: {
        'application/json': ['.json'],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

export type ImportJson = () => Promise<object | null>;
export const importJson: ImportJson = async () => {
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const file = await fileHandle.getFile();
  const text = await file.text();
  return JSON.parse(text) as object;
};

export type CreateRepository = () => Promise<Repository>;
// eslint-disable-next-line @typescript-eslint/require-await
export const createRepository: CreateRepository = async () => {
  const db = createDB();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  return {
    checkNamespace: async namespace => {},
    save: createSave(db),
    list: createList(db),
    get: createGet(db),
    remove: createRemove(db),
    exportJson: createExportJson(db),
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */
};
