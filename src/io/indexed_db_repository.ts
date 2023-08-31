import type {
  KeyValue,
  CheckNamespace,
  Save,
  List,
  Get,
  Remove,
  ExportJson,
  Repository,
} from 'src/io/repository';
import fs from 'fs';
import path from 'path';
import Dexie from 'dexie';
import type { CopyFailError } from 'src/io/repository';

import { PartyJson } from 'src/store/schema/party';
import { BattleJson } from 'src/store/schema/battle';

class KniwDB extends Dexie {
  party: Dexie.Table<PartyJson, string>;
  battle: Dexie.Table<BattleJson, string>;
  constructor () {
    super('KniwDB');
    this.version(1).stores({
      patry: 'name',
      battle: 'title',
    });

    // TODO これ必要？
    this.party = this.table('party');
    this.battle = this.table('battle');
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
// const createDB: CreateDB = () => new Dexie('KniwDB');

type CreateSave = (table: KniwDB) => Save;
const createSave: CreateSave = db => async (namespace, objctKey, data) => {
  const table = getTable(db, namespace);
  await table.put(data);
}

type CreateList = (db: KniwDB) => List;
const createList: CreateList = db => async namespace => {
  const table = getTable(db, namespace);
  const list = await table.toCollection().primaryKeys();
  return list.map(item => '' + item);
};

type CreateGet = (db: KniwDB) => Get;
const createGet: CreateGet = db => async (namespace, objctKey) => {
  const table = getTable(db, namespace);
  return await table.get(objctKey);
};

type CreateRemove = (db: KniwDB) => Remove;
const createRemove: CreateRemove = db => async (namespace, objctKey) => {
  const table = getTable(db, namespace);
  await table.delete(objctKey);
};

type CreateExportJson = (db: KniwDB) => ExportJson;
const createExportJson: CreateExportJson = db => async (namespace, objctKey, fileName) => {
  const table = getTable(db, namespace);
  const json =  await table.get(objctKey);

  const newHandle = await window.showSaveFilePicker();
  const writableStream = await newHandle.createWritable();
  await writableStream.write(JSON.stringify(json));
  await writableStream.close();
  return null;
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

export type ImportJson = () => Promise<object | null>;
export const importJson: ImportJson = async () => {
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const file = await fileHandle.getFile();
  const text = await file.text();
  return JSON.parse(text);
};

export type CreateRepository = () => Promise<Repository>;
export const createRepository: CreateRepository = async () => {
  const db = createDB();
  const table = db.party;
  return {
    checkNamespace: async (namespace) => {},
    save: createSave(db),
    list: createList(db),
    get: createGet(db),
    remove: createRemove(db),
    exportJson: createExportJson(db),
  };
};
