import type { Save, List, Get, Remove, ExportJson, ImportJson, Database } from '@motojouya/kniw/src/io/database';

import Dexie from 'dexie';

import { PartyJson } from '@motojouya/kniw/src/store/schema/party';
import { BattleJson } from '@motojouya/kniw/src/store/schema/battle';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exportJson: ExportJson = async (json, fileName) => {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const importJson: ImportJson = async dammyFileName => {
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const file = await fileHandle.getFile();
  const text = await file.text();
  return JSON.parse(text) as object;
};

export type CreateDatabase = () => Promise<Database>;
 
export const createDatabase: CreateDatabase = async () => {
  const db = createDB();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  return {
    checkNamespace: async namespace => {},
    save: createSave(db),
    list: createList(db),
    get: createGet(db),
    remove: createRemove(db),
    importJson,
    exportJson,
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */
};
