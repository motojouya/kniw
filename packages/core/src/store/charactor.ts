import type { Charactor } from "@motojouya/kniw/src/domain/charactor";
import type { CharactorSchema, CharactorJson } from "@motojouya/kniw/src/store/schema/charactor";

import { toCharactor, toCharactorJson, charactorSchema } from "@motojouya/kniw/src/store/schema/charactor";
import { NotWearableErorr } from "@motojouya/kniw/src/domain/acquirement";
import { DataNotFoundError } from "@motojouya/kniw/src/store/schema/schema";
import { createRepository as createRepositoryBase } from "@motojouya/kniw/src/store/disk_repository";

export const NAMESPACE = "charactor";
export const SCHEMA_KEY = "name";

export const createRepository = createRepositoryBase<
  CharactorSchema,
  Charactor,
  CharactorJson,
  NotWearableErorr | DataNotFoundError
>(NAMESPACE, charactorSchema, toCharactor, toCharactorJson, SCHEMA_KEY);
