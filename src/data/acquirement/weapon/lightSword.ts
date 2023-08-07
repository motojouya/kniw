import type { Weapon } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { chop } from 'src/data/skill/chop';

export const lightSword: Weapon = {
  name: 'lightSword',
  label: '光の剣',
  skills: [chop],
  abilities: [],
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
    AirSuitable: 0,
    ThunderSuitable: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(lightSword, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: ['steelArmor'],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '光の剣。特に特別なわけではないが軽い。',
};
