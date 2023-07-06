import type { Race } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';

export const lizardman: Race = {
  name: 'lizardman',
  label: 'リザードマン',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 10,
    DEX: 10,
    AGI: -10,
    AVD: -10,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 5,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(lizardman, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'リザードマン。物理防御力が高い。',
};
