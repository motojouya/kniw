import type { Race } from 'src/domain/acquirement'

export const hawkman: Race = {
  name: 'hawkman',
  label: 'ホークマン',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 10,
    VIT: 0,
    DEX: -10,
    AGI: 10,
    AVD: 10,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 0,
  },
  validateWearable: validateWearable,
  description: 'ホークマン。飛行移動ができる。',
};

const validateWearable = createValidateWearable(hawkman, {
  wearableRaces: [],
  wearableBlessings: [],
  wearableClothings: [],
  wearableWeapons: [],
});

