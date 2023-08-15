import type { Weapon } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { flameFall } from 'src/data/skill/flameFall';
import { smallHeat } from 'src/data/skill/smallHeat';
import { ghostFire } from 'src/data/skill/ghostFire';

export const rubyRod: Weapon = {
  name: 'rubyRod',
  label: 'ルビーロッド',
  skills: [flameFall, smallHeat, ghostFire],
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
    FireSuitable: 10,
    RockSuitable: 0,
    WaterSuitable: 0,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(rubyRod, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'ルビーロッド。火属性',
};
