import type { Weapon } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { flameFall } from 'src/data/skill/flameFall';

export const fireWand: Weapon = {
  name: 'fireWand',
  label: '炎の杖',
  skills: [flameFall],
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
    StabResistance: 0,
    SlashResistance: 0,
    BlowResistance: 0,
    FireSuitable: 0,
    RockSuitable: 0,
    WaterSuitable: 0,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(fireWand, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: ['fireRobe'],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '炎の杖。大地属性で炎の魔法が打てる杖。',
};
