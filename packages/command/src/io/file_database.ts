import type {
  CheckNamespace,
  Save,
  List,
  Get,
  Remove,
  ExportJson,
  ImportJson,
  Database,
} from "@motojouya/kniw-core/io/database";
import fs from "fs";
import path from "path";
import { CopyFailError } from "@motojouya/kniw-core/io/database";

// 以下実装と、ファイル保存の固有の型
const FILE_EXTENSION = ".json";

const userHome = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
export const repositoryDirectory = path.join(userHome || "", ".kniw");

type IsDataFile = (basePath: string, dirName: string, file: string) => boolean;
const isDataFile: IsDataFile = (basePath, dirName, file) =>
  fs.statSync(path.join(basePath, dirName, file)).isFile() && new RegExp(`.*${FILE_EXTENSION}`).test(file);

type CreateDirctory = (dirName: string) => Promise<void>;
const createDirctory: CreateDirctory = async (dirName) => {
  if (!fs.existsSync(dirName)) {
    await fs.promises.mkdir(dirName);
  }
};

type CreateCheckNamespace = (basePath: string) => CheckNamespace;
const createCheckNamespace: CreateCheckNamespace = (basePath) => async (namespace) =>
  createDirctory(path.join(basePath, namespace));

type ResolvePath = (basePath: string, dirName: string, fileBaseName: string, extension: string) => string;
const resolvePath: ResolvePath = (basePath, dirName, fileBaseName, extension) =>
  path.join(basePath, dirName, fileBaseName + extension);

type CreateSave = (basePath: string) => Save;
const createSave: CreateSave = (basePath) => async (namespace, objctKey, data) =>
  fs.promises.writeFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), JSON.stringify(data));

type CreateList = (basePath: string) => List;
const createList: CreateList = (basePath) => async (namespace) => {
  try {
    const files = await fs.promises.readdir(path.join(basePath, namespace));
    return files
      .filter((file) => isDataFile(basePath, namespace, file))
      .map((file) => path.basename(file, FILE_EXTENSION));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = e as any;
    if (error.code === "ENOENT") {
      return [];
    } else {
      throw e;
    }
  }
};

type CreateGet = (basePath: string) => Get;
const createGet: CreateGet = (basePath) => async (namespace, objctKey) => {
  try {
    const contents = await fs.promises.readFile(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), {
      encoding: "utf8",
    });
    return JSON.parse(contents);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = e as any;
    if (error.code === "ENOENT") {
      return null;
    } else {
      throw e;
    }
  }
};

type CreateRemove = (basePath: string) => Remove;
const createRemove: CreateRemove = (basePath) => async (namespace, objctKey) => {
  try {
    await fs.promises.unlink(resolvePath(basePath, namespace, objctKey, FILE_EXTENSION));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = e as any;
    if (error.code !== "ENOENT") {
      throw e;
    }
  }
};

// FIXME エラーが粗いので細かくしたい。参照書き込み権限とか、ディレクトリの存在有無とか
// ただし、fsのエラーメッセージが一緒なら意味がない
const exportJson: ExportJson = async (json, fileName) => {
  const text = JSON.stringify(json);
  try {
    await fs.promises.writeFile(fileName, text);
    // FIXME old copy pattern
    // await fs.promises.copyFile(
    //   resolvePath(basePath, namespace, objctKey, FILE_EXTENSION), // storageFileName
    //   fileName,
    //   fs.constants.COPYFILE_EXCL,
    // );
    return null;
  } catch (e) {
    return new CopyFailError(fileName, e, `${fileName}へコピーに失敗しました`);
  }
};

export const importJson: ImportJson = async (fileName) => {
  try {
    const contents = await fs.promises.readFile(fileName, {
      encoding: "utf8",
    });
    return JSON.parse(contents);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = e as any;
    if (error.code === "ENOENT") {
      return null;
    } else {
      throw e;
    }
  }
};

export type CreateDatabase = (basePath: string) => Promise<Database>;
export const createDatabase: CreateDatabase = async (basePath) => {
  await createDirctory(basePath);
  return {
    checkNamespace: createCheckNamespace(basePath),
    save: createSave(basePath),
    list: createList(basePath),
    get: createGet(basePath),
    remove: createRemove(basePath),
    importJson,
    exportJson,
  };
};
