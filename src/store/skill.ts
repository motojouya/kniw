import * as skills from "@motojouya/kniw/src/data/skill/index";
import { createMemoryRepository } from "@motojouya/kniw/src/store/memory_repository";

export const skillRepository = createMemoryRepository(skills);
