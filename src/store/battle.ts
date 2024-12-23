import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { BattleJson, BattleSchema } from '@motojouya/kniw/src/store/schema/battle';

import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { DataNotFoundError } from '@motojouya/kniw/src/store/disk_repository';
import { toBattleJson, toBattle, battleSchema } from '@motojouya/kniw/src/store/schema/battle';
import { createRepository as createRepositoryBase } from '@motojouya/kniw/src/store/disk_repository';

const NAMESPACE = 'battle';
const SCHEMA_KEY = 'title';

const createRepository = createRepositoryBase<
  BattleSchema,
  Battle,
  BattleJson,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError | NotBattlingError
>(NAMESPACE, battleSchema, toBattle, toBattleJson, SCHEMA_KEY);
