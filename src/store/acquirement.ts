import type { Acquirement, Race, Weapon, Clothing, Blessing } from '@motojouya/kniw/src/domain/acquirement';
import * as races from '@motojouya/kniw/src/data/acquirement/race/index';
import * as weapons from '@motojouya/kniw/src/data/acquirement/weapon/index';
import * as clothings from '@motojouya/kniw/src/data/acquirement/clothing/index';
import * as blessings from '@motojouya/kniw/src/data/acquirement/blessing/index';
import { createMemoryRepository } from '@motojouya/kniw/src/store/memory_repository';

export const raceRepository = createMemoryRepository(races);
export const weaponRepository = createMemoryRepository(weapons);
export const clothingRepository = createMemoryRepository(clothings);
export const blessingRepository = createMemoryRepository(blessings);
