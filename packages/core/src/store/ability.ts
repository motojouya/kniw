import * as abilities from "@motojouya/kniw/src/data/ability/index";
import { createMemoryRepository } from "@motojouya/kniw/src/store/memory_repository";

export const abilityRepository = createMemoryRepository(abilities);
