import type { Weapon } from 'src/domain/acquirement'
import { chop } from 'src/data/skill/chop'

export const lightSword: Weapon = {
  name: 'lightSword',
  label: '光の剣',
  skills: [chop],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 20,
    VIT: 10,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 10,
  },
  validateWearable: validateWearable,
  description: '光の剣。特に特別なわけではないが軽い。',
};

const validateWearable = createValidateWearable(lightSword, {
  wearableRaces: [],
  wearableBlessings: [],
  wearableClothings: ['steelArmor'],
  wearableWeapons: [],
});

