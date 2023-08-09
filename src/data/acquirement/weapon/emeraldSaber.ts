import type { Weapon } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { chop } from 'src/data/skill/chop';
import { dazzle } from 'src/data/skill/dazzle';
import { windEdge } from 'src/data/skill/windEdge';
import { rampartForce } from 'src/data/ability/rampartForce';

export const emeraldSaber: Weapon = {
  name: 'emeraldSaber',
  label: 'エメラルドサーベル',
  skills: [chop, windEdge, dazzle],
  abilities: [rampartForce],
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
    AirSuitable: 10,
    ThunderSuitable: 0,
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
