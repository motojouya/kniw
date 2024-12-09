import type { Weapon } from '@motojouya/kniw/src/domain/acquirement';
import { createValidateWearable } from '@motojouya/kniw/src/domain/acquirement';
import { chop } from '@motojouya/kniw/src/data/skill/chop';
import { dazzle } from '@motojouya/kniw/src/data/skill/dazzle';
import { windEdge } from '@motojouya/kniw/src/data/skill/windEdge';
import { rampartForce } from '@motojouya/kniw/src/data/ability/rampartForce';

export const emeraldSaber: Weapon = {
  name: 'emeraldSaber',
  label: 'エメラルドサーベル',
  skills: [chop, windEdge, dazzle],
  abilities: [rampartForce],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 20,
    AGI: 0,
    AVD: 0,
    INT: 10,
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
    const validate = createValidateWearable(emeraldSaber, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'エメラルドサーベル。風属性',
};
