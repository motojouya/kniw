import type { Weapon } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';
import { stab } from 'src/data/skill/stab';
import { dazzle } from 'src/data/skill/dazzle';
import { saturnRing } from 'src/data/skill/saturnRing';
import { rampartForce } from 'src/data/ability/rampartForce';

export const rapier: Weapon = {
  name: 'rapier',
  label: 'レイピア',
  skills: [stab, saturnRing, dazzle],
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
    AirSuitable: 0,
    ThunderSuitable: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(rapier, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'レイピア。刺突武器',
};
