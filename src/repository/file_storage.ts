import fs from 'fs'

type CreateDirectory = (dir: string) => Promise<void>;
const createDirectory: CreateDirectory = async dir => {
  if (!fs.existsSync(dir)) {
    return await fs.promises.mkdir(dir);
  }
};

type CreateStorage = (basedir: string) => Promise<void>;
const createStorage: CreateStorage = async basedir => {
  await createDirectory(basedir);
  await createDirectory(basedir + '/charactor');
  await createDirectory(basedir + '/paty');
  await createDirectory(basedir + '/battle');
};

type Save = (fileName: string, text: string) => Promise<void>;
const save: Save = async (fileName, text) => fs.promises.writeFile(fileName, text);

type List = (dirName: string) => Promise<string[]>;
const list: List = async dirName => fs.promises.readdir(dirName).then(files => files.filter(file => fs.statSync(dirName + '/' + file).isFile() && /.*\.json/.test(file)));

async function test () {
  const homeDir: string | undefined = process.env.HOMEPATH || process.env.HOME;
  if (!homeDir) {
      console.log('something err.');
      return;
  }
  const baseDir: string = (homeDir as string) + '/.kniw';
  await createStorage(baseDir);
  console.log('dir created!')

  const files = await list(baseDir + '/charactor');
  console.log(files);
  //const name: string = 'jonny';
  //const charSetting: object = {
  //  "weapon": "ax",
  //  "armar": "blue",
  //  "element": "fire",
  //};
  //await save(baseDir + '/charactor/' + name + '.json', JSON.stringify(charSetting));
  //console.log('file created!');
}

test();
