import type { Clothing } from '@motojouya/kniw/src/domain/acquirement';
import { createValidateWearable } from '@motojouya/kniw/src/domain/acquirement';
import { mpGainPlus } from '@motojouya/kniw/src/data/ability/mpGainPlus';
import { stoneShell } from '@motojouya/kniw/src/data/skill/stoneShell';

export const cyanRobe: Clothing = {
  name: 'cyanRobe',
  label: '水色の衣',
  skills: [stoneShell],
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
    RockSuitable: 10,
    WaterSuitable: 0,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(cyanRobe, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '水色の衣。岩属性',
};
