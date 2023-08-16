import type { Weapon } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { chop } from 'src/data/skill/chop';
import { gunWater } from 'src/data/skill/gunWater';
import { dazzle } from 'src/data/skill/dazzle';
import { rampartForce } from 'src/data/ability/rampartForce';

export const sapphireSaber: Weapon = {
  name: 'sapphireSaber',
  label: 'サファイアサーベル',
  skills: [chop, gunWater, dazzle],
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
    WaterSuitable: 10,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(sapphireSaber, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'サファイアサーベル。水属性',
};
