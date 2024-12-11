import type { Weapon } from '@motojouya/kniw/src/domain/acquirement';
import { createValidateWearable } from '@motojouya/kniw/src/domain/acquirement';
import { gunWater } from '@motojouya/kniw/src/data/skill/gunWater';
import { stickyRain } from '@motojouya/kniw/src/data/skill/stickyRain';
import { downRushing } from '@motojouya/kniw/src/data/skill/downRushing';

export const sapphireStaff: Weapon = {
  name: 'sapphireStaff',
  label: 'サファイアスタッフ',
  skills: [gunWater, downRushing, stickyRain],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 30,
    MND: 0,
    RES: 0,
    WT: 10,
    StabResistance: 0,
    SlashResistance: 0,
    BlowResistance: 0,
    FireSuitable: 0,
    RockSuitable: 0,
    WaterSuitable: 10,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(sapphireStaff, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'サファイアスタッフ。水属性',
};