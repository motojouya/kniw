import { z } from 'zod';

export type ToModel<M, J, E> = (json: J) => M | E;
export type ToJson<M, J> = (model: M) => J;

export class JsonSchemaUnmatchError {
  constructor(
    readonly error: any,
    readonly message: string,
  ) {}
}

export class DataNotFoundError {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly message: string,
  ) {}
}

export class DataExistError {
  constructor(
    readonly name: string,
    readonly type: string,
    readonly message: string,
  ) {}
}

export function parseJson<S extends z.ZodTypeAny>(schema: S): (json: unknown) => z.infer<S> | JsonSchemaUnmatchError {
  // eslint-disable-next-line func-names
  return function (json) {

    const result = schema.safeParse(json);
    if (result.success) {
      return result.data;
    } else {
      return new JsonSchemaUnmatchError(result.error, '想定されたjson schemaのデータではありません');
    }
  };
}
