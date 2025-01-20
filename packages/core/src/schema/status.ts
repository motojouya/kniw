import type { Status } from "@motojouya/kniw/src/domain/status";
import type { ToModel, ToJson } from "@motojouya/kniw/src/store/schema/schema";

import { z } from "zod";

import { DataNotFoundError } from "@motojouya/kniw/src/store/schema/schema";
import { statusRepository } from "@motojouya/kniw/src/store/status";

export const statusSchema = z.string();
export type StatusSchema = typeof statusSchema;
export type StatusJson = z.infer<StatusSchema>;

export const toStatusJson: ToJson<Status, StatusJson> = (status) => status.name;

export const toStatus: ToModel<Status, StatusJson, DataNotFoundError> = (statusJson) => {
  const status = statusRepository.get(statusJson);
  if (!status) {
    return new DataNotFoundError(statusJson, "status", `${statusJson}というstatusは存在しません`);
  }

  return status;
};
