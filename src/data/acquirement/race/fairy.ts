import type { Race } from 'src/domain/acquirement'
import { createValidateWearable } from 'src/domain/acquirement'

export const fairy: Race = {
  name: 'fairy',
  label: 'フェアリー',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: -10,
    VIT: 0,
    DEX: 0,
    AGI: 10,
    AVD: 10,
    INT: 10,
    MND: 0,
    RES: 0,
    WT: 0,
  },
  validateWearable: (race, weapon, clothing, blessing) => {
    const validate = createValidateWearable(fairy, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, weapon, clothing, blessing);
  },
  description: 'フェアリー。魔法攻撃力が高い。',
};

