import type { Weapon } from '@motojouya/kniw/src/domain/acquirement';
import { createValidateWearable } from '@motojouya/kniw/src/domain/acquirement';
import { chop } from '@motojouya/kniw/src/data/skill/chop';
import { push } from '@motojouya/kniw/src/data/skill/push';
import { dazzle } from '@motojouya/kniw/src/data/skill/dazzle';
import { shootingGuard } from '@motojouya/kniw/src/data/ability/shootingGuard';
import { rampartForce } from '@motojouya/kniw/src/data/ability/rampartForce';

export const swordAndShield: Weapon = {
  name: 'swordAndShield',
  label: '剣と盾',
  skills: [chop, push, dazzle],
  abilities: [rampartForce, shootingGuard],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 10,
    DEX: 20,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 20,
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
    const validate = createValidateWearable(swordAndShield, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: '剣と盾のセット',
};
