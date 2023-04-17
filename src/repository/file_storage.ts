import fs from 'fs'

async function createDirectory(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    return fs.promises.mkdir(dir);
  }
};

async function createStorage(homedir: string): Promise<void> {
  await createDirectory(homedir + '/.kniw');
  await createDirectory(homedir + '/.kniw/charactor');
  await createDirectory(homedir + '/.kniw/paty');
  await createDirectory(homedir + '/.kniw/battle');
};

const homeDir: string | undefined = process.env.HOMEPATH || process.env.HOME;

createStorage(homeDir as string).then(r => console.log(r, 'dir created!'))

