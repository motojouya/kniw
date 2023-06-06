import { Race, tentativeValidateWearable, createValidateWearable } from 'src/domain/acquirement'

const tentativeRace: Race = {
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
  validateWearable: tentativeValidateWearable,
  description: 'フェアリー。魔法攻撃力が高い。',
};

tentativeRace.validateWearable = createValidateWearable(tentativeRace, {
  wearableRaces: [],
  wearableBlessings: [],
  wearableClothings: [],
  wearableWeapons: [],
});

export const fairy = tentativeRace;

