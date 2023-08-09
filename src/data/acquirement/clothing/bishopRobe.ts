import type { Clothing } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { mpGainPlus } from 'src/data/ability/mpGainPlus';

export const bishopRobe: Clothing = {
  name: 'bishopRobe',
  label: '司教の服',
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
    WT: 5,
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
    const validate = createValidateWearable(bishopRobe, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'スキルがないが性能が高い',
};