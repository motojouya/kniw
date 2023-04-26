import fs from 'fs'
import path from 'path';
import {
  Save,
  List,
  Get,
  Remove,
  CreateSave,
  CreateList,
  CreateGet,
  CreateRemove,
  Repository,
  CreateRepository,
  CheckNamespace,
  CreateCheckNamespace,
} from 'src/repository/repository';

const FILE_EXTENSION = '.json';

type IsDataFile = (dirName: string, file: string) => boolean;
const isDataFile: IsDataFile = (dirName, file) => fs.statSync(path.join(dirName, file)).isFile() && new RegExp('.*' + FILE_EXTENSION).test(file)

type CreateDirctory = async (dirName: string) => Promise<void>
const createDirctory: CreateDirctory = async dirName => {
  if (!fs.existsSync(dirName)) {
    return await fs.promises.mkdir(dirName);
  }
};

const createCheckNamespace: CreateCheckNamespace =
  basePath =>
  async namespace =>
  createDirctory(path.join(basePath, namespace));

type ResolvePath = (basePath: string, dirName: string, fileBaseName: string, extension: string) => string
const resolvePath: ResolvePath = (basePath, dirName, fileBaseName, extension) => path.join(basePath, dirName, (fileBaseName + FILE_EXTENSION))

const createSave: CreateSave =
  basePath =>
  async (namespace, objctKey, json) =>
  fs.promises.writeFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), JSON.stringify(data));

const createList: CreateList =
  basePath =>
  async namespace =>
  fs.promises.readdir(path.join(basePath, dirName)).then(
    files => files.filter(file => isDataFile(namespace, file)).map(file => path.basename(file, FILE_EXTENSION))
  );

const createGet: CreateGet =
  basePath =>
  async (namespace, objctKey) =>
  fs.promises.readFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), { encoding: "utf8" }).then(contents => JSON.parse(contents));

const createRemove: CreateRemove =
  basePath =>
  async (namespace, objctKey) =>
  fs.promises.unlink(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION));

export const createRepository: CreateRepository = async (basePath, tables) => {
  await createDirctory(basePath);
  //await Promise.all(tables.map(async table => await createDirectory(path.join(basePath, table))));
  return {
    checkNamespace: createCheckNamespace(basePath),
    save: createSave(basePath),
    list: createList(basePath),
    get: createGet(basePath),
    remove: createRemove(basePath),
  };
};

//async function test () {
//  const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
//  if (!homeDir) {
//      console.log('something err.');
//      return;
//  }
//  const baseDir: string = path.join((homeDir as string), ".kniw")
//  const tables = ['charactor', 'paty', 'battle'];
//  await createStorage(baseDir, tables);
//  console.log('dir created!')
//
//  const files = await list(baseDir + '/charactor');
//  console.log(files);
//
//  const contents = await get(baseDir + '/charactor/' + files[0] + '.json');
//  console.log(contents);
//
//  const name: string = 'jonny';
//  const charSetting: object = {
//    "weapon": "ax",
//    "armar": "red",
//    "element": "fire",
//  };
//  await save(baseDir + '/charactor/' + name + '.json', JSON.stringify(charSetting));
//  console.log('file created!');
//
//  const contents2 = await get(baseDir + '/charactor/' + files[0] + '.json');
//  console.log(contents2);
//
//  await remove(baseDir + '/charactor/' + files[1] + '.json');
//
//  const files2 = await list(baseDir + '/charactor');
//  console.log(files2);
//}
//
//test();
