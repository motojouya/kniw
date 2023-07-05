import { FromSchema } from "json-schema-to-ts";
import { createValidationCompiler } from 'src/io/json_schema'
import { createStatus as createStatusFromStore } from 'src/store/status'
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';

export type Status = {
  name: string,
  label: string,
  restWt: number,
  description: string,
}

export const statusSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    restWt: { type: "integer" },
  },
  required: ["name", "restWt"],
} as const;

export type StatusJson = FromSchema<typeof statusSchema>;

export type CreateStatusJson = (status: Status) => StatusJson;
export const createStatusJson: CreateStatusJson = status => ({
  name: status.name,
  restWt: status.restWt,
});

export type CreateStatus = (statusJson: any) => Status | DataNotFoundError | JsonSchemaUnmatchError;
export const createStatus: CreateStatus = statusJson => {

  const compile = createValidationCompiler();
  const validateSchema = compile(statusSchema)
  if (!validateSchema(statusJson)) {
    // @ts-ignore
    const errors = validateSchema.errors;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'statusのjsonデータではありません');
  }

  const status = createStatusFromStore(statusJson.name);
  if (!status) {
    return new DataNotFoundError(statusJson.name, 'status', statusJson.name + 'というstatusは存在しません');
  }

  status.restWt = statusJson.restWt;
  return status;
}

