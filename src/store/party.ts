import type { Party } from '@motojouya/kniw/src/domain/party';
import type { PartyJson, PartySchema } from '@motojouya/kniw/src/store/schema/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';

import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toParty, toPartyJson, partySchema } from '@motojouya/kniw/src/store/schema/party';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { createRepository as createRepositoryBase } from '@motojouya/kniw/src/store/disk_repository';

export const NAMESPACE = 'party';
export const SCHEMA_KEY = 'name';

export type PartyRepository = Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError>;

export const createRepository = createRepositoryBase<
  PartySchema,
  Party,
  PartyJson,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError
>(NAMESPACE, partySchema, toParty, toPartyJson, SCHEMA_KEY);
