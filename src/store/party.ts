import type { Party } from '@motojouya/kniw/src/domain/party';
import type { PartyJson, PartySchema } from '@motojouya/kniw/src/store/schema/party';

import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toParty, toPartyJson, partySchema } from '@motojouya/kniw/src/store/schema/party';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { DataNotFoundError } from '@motojouya/kniw/src/store/disk_repository';
import { createRepository as createRepositoryBase } from '@motojouya/kniw/src/store/disk_repository';

const NAMESPACE = 'party';
const SCHEMA_KEY = 'name';

const createRepository = createRepositoryBase<
  PartySchema,
  Party,
  PartyJson,
  NotWearableErorr | DataNotFoundError | CharactorDuplicationError
>(NAMESPACE, partySchema, toParty, toPartyJson, SCHEMA_KEY);
