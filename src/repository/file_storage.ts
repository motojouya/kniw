import fs from 'fs'
import path from 'path';

const FILE_EXTENSION = '.json';

type IsDataFile = (dirName: string, file: string) => boolean;
const isDataFile: IsDataFile = (dirName, file) => fs.statSync(path.join(dirName, file)).isFile() && new RegExp('.*' + FILE_EXTENSION).test(file)

type CreateDirectory = (dir: string) => Promise<void>;
const createDirectory: CreateDirectory = async dir => {
  if (!fs.existsSync(dir)) {
    return await fs.promises.mkdir(dir);
  }
};

type ResolvePath = (dirName: string, fileBaseName: string, extension: string) => string
const resolvePath: ResolvePath = (dirName, fileBaseName, extension) => path.join(dirName, (fileBaseName + FILE_EXTENSION))

export type CreateStorage = (basedir: string, tables: string[]) => Promise<void>;
export const createStorage: CreateStorage = async (basedir, tables) => {
  await createDirectory(basedir);
  tables.forEach(async table => await createDirectory(path.join(basedir, table)));
};

export type Save = (namespace: string, objctKey: string, data: object) => Promise<void>;
export const save: Save = async (dirName, objctKey, json) => fs.promises.writeFile(resolvePath(dirName, objctKey, FILE_EXTENSION), JSON.stringify(data));

export type List = (namespace: string) => Promise<string[]>;
export const list: List = async namespace => fs.promises.readdir(namespace).then(
  files => files.filter(file => isDataFile(namespace, file)).map(file => path.basename(file, FILE_EXTENSION))
);

export type Get = (namespace: string, objctKey: string) => Promise<object>;
export const get: Get = async (namespace, objctKey) => fs.promises.readFile(resolvePath(namespace, objctKey, FILE_EXTENSION), { encoding: "utf8" }).then(contents => JSON.parse(contents));

export type Remove = (namespace: string, objctKey: string) => Promise<void>;
export const remove: Remove = async (namespace, objctKey) => fs.promises.unlink(resolvePath(namespace, objctKey, FILE_EXTENSION));

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
