import type { Weapon } from '@motojouya/kniw/src/domain/acquirement';
import { createValidateWearable } from '@motojouya/kniw/src/domain/acquirement';
import { windEdge } from '@motojouya/kniw/src/data/skill/windEdge';
import { danceLeaves } from '@motojouya/kniw/src/data/skill/danceLeaves';
import { clearCloud } from '@motojouya/kniw/src/data/skill/clearCloud';

export const emeraldStick: Weapon = {
  name: 'emeraldStick',
  label: 'エメラルドステッキ',
  skills: [windEdge, danceLeaves, clearCloud],
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
    WaterSuitable: 0,
    IceSuitable: 0,
    AirSuitable: 10,
    ThunderSuitable: 0,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(emeraldStick, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'エメラルドステッキ。風属性',
};
