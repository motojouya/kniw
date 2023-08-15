import type { Clothing } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { mpGainPlus } from 'src/data/ability/mpGainPlus';
import { waterCutter } from 'src/data/skill/waterCutter';

export const blueRobe: Clothing = {
  name: 'blueRobe',
  label: '青の衣',
  skills: [waterCutter],
  abilities: [mpGainPlus],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 10,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 20,
    RES: 0,
    WT: 20,
    StabResistance: 0,
    SlashResistance: 0,
    BlowResistance: 0,
    FireSuitable: 0,
    RockSuitable: 0,
    WaterSuitable: 10,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(blueRobe, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '青の衣。水属性',
};
