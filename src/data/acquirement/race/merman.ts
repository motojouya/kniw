import type { Race } from 'src/domain/acquirement'

export const merman: Race = {
  name: 'merman',
  label: 'マーマン',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 0,
    AGI: -10,
    AVD: -10,
    INT: 0,
    MND: 10,
    RES: 10,
    WT: 0,
  },
  validateWearable: validateWearable,
  description: 'マーマン。魔法防御力が高い。',
};

const validateWearable = createValidateWearable(merman, {
  wearableRaces: [],
  wearableBlessings: [],
  wearableClothings: [],
  wearableWeapons: [],
});

