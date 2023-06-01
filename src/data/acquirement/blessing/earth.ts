import type { Blessing } from 'src/domain/acquirement'

export const earth: Blessing = {
  name: 'earth',
  label: '大地',
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
  description: '大地の祝福',
};

const validateWearable = createValidateWearable(earth, {
  wearableRaces: [
    'human',
    'werewolf',
    'lizardman',
    'golem',
  ],
  wearableBlessings: [],
  wearableClothings: [],
  wearableWeapons: [],
});

