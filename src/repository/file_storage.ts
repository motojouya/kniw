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

export type CreateStorage = (basedir: string, tables: string[]) => Promise<void>;
export const createStorage: CreateStorage = async (basedir, tables) => {
  await createDirectory(basedir);
  tables.forEach(async table => await createDirectory(path.join(basedir, table)));
};

export type Save = (fileName: string, text: string) => Promise<void>;
export const save: Save = async (fileName, text) => fs.promises.writeFile(fileName, text);

export type List = (dirName: string) => Promise<string[]>;
export const list: List = async dirName => fs.promises.readdir(dirName).then(
  files => files.filter(file => isDataFile(dirName, file)).map(file => path.basename(file, FILE_EXTENSION))
);

export type Get = (fileName: string) => Promise<object>;
export const get: Get = async fileName => fs.promises.readFile(fileName, { encoding: "utf8" }).then(contents => JSON.parse(contents));

export type Remove = (fileName: string) => Promise<void>;
export const remove: Remove = async fileName => fs.promises.unlink(fileName);

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
