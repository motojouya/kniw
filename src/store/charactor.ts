import type { Charactor } from '@motojouya/kniw/src/domain/charactor';
import type { CharactorSchema, CharactorJson } from '@motojouya/kniw/src/store/schema/charactor';

import { toCharactor, toCharactorJson, charactorSchema } from '@motojouya/kniw/src/store/schema/charactor';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { createRepository } from '@motojouya/kniw/src/store/disk_repository';

const NAMESPACE = 'charactor';
const SCHEMA_KEY = 'name';

const createCharactorRepository = createRepository<
  CharactorSchema,
  Charactor,
  CharactorJson,
  NotWearableErorr | DataNotFoundError
>(NAMESPACE, charactorSchema, toCharactor, toCharactorJson, SCHEMA_KEY);
