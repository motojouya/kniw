import type { Status } from '@motojouya/kniw/src/domain/status';

import { FromSchema } from 'json-schema-to-ts';

import { createValidationCompiler } from '@motojouya/kniw/src/io/json_schema';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { getStatus } from '@motojouya/kniw/src/store/status';

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
