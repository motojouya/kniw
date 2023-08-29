export class CopyFailError {
  constructor(
    readonly fileName: string,
    readonly exception: any,
    readonly message: string,
  ) {}
}

export type KeyValue = { [name: string]: any };

// FIXME データ保存の選択肢が増えたら、型だけ別ファイルに移動
export type CheckNamespace = (namespace: string) => Promise<void>;
export type Save = (namespace: string, objctKey: string, data: KeyValue) => Promise<void>;
export type List = (namespace: string) => Promise<string[]>;
export type Get = (namespace: string, objctKey: string) => Promise<KeyValue | null>;
export type Remove = (namespace: string, objctKey: string) => Promise<void>;
export type Copy = (namespace: string, objctKey: string, fileName: string) => Promise<null | CopyFailError>;

export type Repository = {
  checkNamespace: CheckNamespace;
  save: Save;
  list: List;
  get: Get;
  remove: Remove;
  copy: Copy;
};

// TODO 共通化できるか？
// export type ReadJson = (fileName: string) => Promise<object | null>;
