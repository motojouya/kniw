import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';
import { getStatus } from 'src/store/status';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import type { Charactor } from 'src/domain/charactor';

export type Status = {
  name: string;
  label: string;
  wt: number;
  description: string;
};

export const statusSchema = { type: 'string' } as const;

export type StatusJson = FromSchema<typeof statusSchema>;

export type ToStatusJson = (status: Status) => StatusJson;
export const toStatusJson: ToStatusJson = status => status.name;

export type ToStatus = (statusJson: any) => Status | DataNotFoundError | JsonSchemaUnmatchError;
export const toStatus: ToStatus = statusJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(statusSchema);
  if (!validateSchema(statusJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'statusのjsonデータではありません');
  }

  const status = getStatus(statusJson);
  if (!status) {
    return new DataNotFoundError(statusJson, 'status', `${statusJson}というstatusは存在しません`);
  }

  return status;
};

export type UnderStatus = (status: Status, charactor: Charactor) => boolean;
export const underStatus: UnderStatus = (status, charactor) =>
  !!charactor.statuses.find(s => s.status.name === status.name);
