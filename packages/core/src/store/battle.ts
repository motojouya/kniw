import type { Battle } from "@motojouya/kniw/src/domain/battle";
import type { BattleJson, BattleSchema } from "@motojouya/kniw/src/store/schema/battle";
import type { Repository } from "@motojouya/kniw/src/store/disk_repository";

import { NotBattlingError } from "@motojouya/kniw/src/domain/battle";
import { CharactorDuplicationError } from "@motojouya/kniw/src/domain/party";
import { NotWearableErorr } from "@motojouya/kniw/src/domain/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "@motojouya/kniw/src/store/schema/schema";
import { toBattleJson, toBattle, battleSchema } from "@motojouya/kniw/src/store/schema/battle";
import { createRepository as createRepositoryBase } from "@motojouya/kniw/src/store/disk_repository";

export const NAMESPACE = "battle";
export const SCHEMA_KEY = "title";

export type BattleRepository = Repository<
  Battle,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | NotBattlingError | JsonSchemaUnmatchError
>;

export const createRepository = createRepositoryBase<
  BattleSchema,
  Battle,
  BattleJson,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | NotBattlingError | JsonSchemaUnmatchError
>(NAMESPACE, battleSchema, toBattle, toBattleJson, SCHEMA_KEY);
