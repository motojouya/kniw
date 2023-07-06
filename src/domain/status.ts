import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';
import { getStatus } from 'src/store/status';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

export type Status = {
  name: string;
  label: string;
  restWt: number;
  description: string;
};

export const statusSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    restWt: { type: 'integer' },
  },
  required: ['name', 'restWt'],
} as const;

export type StatusJson = FromSchema<typeof statusSchema>;

export type ToStatusJson = (status: Status) => StatusJson;
export const toStatusJson: ToStatusJson = status => ({
  name: status.name,
  restWt: status.restWt,
});

export type ToStatus = (statusJson: any) => Status | DataNotFoundError | JsonSchemaUnmatchError;
export const toStatus: ToStatus = statusJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(statusSchema);
  if (!validateSchema(statusJson)) {
    // @ts-ignore
    const {errors} = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'statusのjsonデータではありません');
  }

  const status = getStatus(statusJson.name);
  if (!status) {
    return new DataNotFoundError(statusJson.name, 'status', `${statusJson.name  }というstatusは存在しません`);
  }

  status.restWt = statusJson.restWt;
  return status;
};
