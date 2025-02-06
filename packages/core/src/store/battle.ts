import type { Battle } from "../model/battle";
import type { BattleJson, BattleSchema } from "../store_schema/battle";
import type { Repository } from "../store_utility/disk_repository";

import { NotBattlingError } from "../model/battle";
import { CharactorDuplicationError } from "../model/party";
import { NotWearableErorr } from "../model/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "../store_utility/schema";
import { toBattleJson, toBattle, battleSchema } from "../store_schema/battle";
import { createRepository as createRepositoryBase } from "../store_utility/disk_repository";

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
