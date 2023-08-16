import type { Race } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';

export const hawkman: Race = {
  name: 'hawkman',
  label: 'ホークマン',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 10,
    VIT: 0,
    DEX: -10,
    AGI: 10,
    AVD: 10,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 0,
    StabResistance: 0,
    SlashResistance: 0,
    BlowResistance: 0,
    FireSuitable: 0,
    RockSuitable: 0,
    WaterSuitable: 0,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(hawkman, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'ホークマン。飛行移動ができる。',
};
