import type { Race } from 'src/domain/acquirement'
import { createValidateWearable } from 'src/domain/acquirement'

export const golem: Race = {
  name: 'golem',
  label: 'ゴーレム',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 10,
    AGI: -10,
    AVD: -10,
    INT: 0,
    MND: 10,
    RES: 0,
    WT: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(golem, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'ゴーレム。とにかく堅い。',
};

