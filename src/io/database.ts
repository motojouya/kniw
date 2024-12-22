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
export type ExportJson = (json: object, fileName: string) => Promise<null | CopyFailError>;
export type ImportJson = (fileName: string) => Promise<object | null>;

export type Repository = {
  checkNamespace: CheckNamespace;
  save: Save;
  list: List;
  get: Get;
  remove: Remove;
  importJson: ImportJson;
  exportJson: ExportJson;
};
