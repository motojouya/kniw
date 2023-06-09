import type { Clothing } from 'src/domain/acquirement'
import { createValidateWearable } from 'src/domain/acquirement'
import { mpGainPlus } from 'src/data/ability/mpGainPlus'

export const fireRobe: Clothing = {
  name: 'fireRobe',
  label: '炎の衣',
  skills: [],
  abilities: [mpGainPlus],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 10,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 10,
    MND: 20,
    RES: 0,
    WT: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(fireRobe, {
      wearableRaces: [],
      wearableBlessings: [
        'mind',
        'earth',
      ],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '炎の衣。魔法耐久が高い',
};
