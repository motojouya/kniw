import type { Blessing } from 'src/domain/acquirement'

export const sea: Blessing = {
  name: 'sea',
  label: '海',
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
  validateWearable: validateWearable,
  description: '海の祝福',
};

const validateWearable = createValidateWearable(sea, {
  wearableRaces: [
    'human',
    'fairy',
    'lizardman',
    'merman',
  ],
  wearableBlessings: [],
  wearableClothings: [],
  wearableWeapons: [],
});

