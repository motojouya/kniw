import type { Blessing } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';

export const sky: Blessing = {
  name: 'sky',
  label: '空',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(sky, {
      wearableRaces: ['human', 'fairy', 'werewolf', 'hawkman'],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '空の祝福',
};
