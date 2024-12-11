import type { Status } from '@motojouya/kniw/src/domain/status';

import { z } from "zod";

import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { getStatus } from '@motojouya/kniw/src/store/status';

export const statusSchema = z.string();
export type StatusJson = z.infer<typeof statusSchema>;

export type ToStatusJson = (status: Status) => StatusJson;
export const toStatusJson: ToStatusJson = status => status.name;

export type ToStatus = (statusJson: any) => Status | DataNotFoundError | JsonSchemaUnmatchError;
export const toStatus: ToStatus = statusJson => {

  const result = statusSchema.safeParse(statusJson);
  if (!result.success) {
    return new JsonSchemaUnmatchError(result.error, 'statusのjsonデータではありません');
  }

  const status = getStatus(result.data);
  if (!status) {
    return new DataNotFoundError(statusJson, 'status', `${statusJson}というstatusは存在しません`);
  }

  return status;
};
