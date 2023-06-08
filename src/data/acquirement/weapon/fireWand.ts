import type { Weapon } from 'src/domain/acquirement'
import { createValidateWearable } from 'src/domain/acquirement'
import { volcanoRise } from 'src/data/skill/volcanoRise'

export const fireWand: Weapon = {
  name: 'fireWand',
  label: '炎の杖',
  skills: [volcanoRise],
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
  validateWearable: (race, weapon, clothing, blessing) => {
    const validate = createValidateWearable(fireWand, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: ['fireRobe'],
      wearableWeapons: [],
    });
    return validate(race, weapon, clothing, blessing);
  },
  description: '炎の杖。大地属性で炎の魔法が打てる杖。',
};

