import type { Clothing } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { coldFeet } from 'src/data/skill/coldFeet';

export const steelArmor: Clothing = {
  name: 'steelArmor',
  label: '鋼鉄の鎧',
  skills: [coldFeet],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 20,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 10,
    RES: 0,
    WT: 10,
    StabResistance: 10,
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
    const validate = createValidateWearable(steelArmor, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '鋼鉄の鎧。刺突耐性がある',
};
