import type { Status } from '@motojouya/kniw/src/domain/status';
import * as statuses from '@motojouya/kniw/src/data/status/index';
import { createMemoryRepository } from '@motojouya/kniw/src/store/memory_repository';

export const statusRepository = createMemoryRepository(statuses);
