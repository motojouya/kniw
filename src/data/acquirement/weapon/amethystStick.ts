import type { Weapon } from '@motojouya/kniw/src/domain/acquirement';
import { createValidateWearable } from '@motojouya/kniw/src/domain/acquirement';
import { higherBolt } from '@motojouya/kniw/src/data/skill/higherBolt';
import { electricShock } from '@motojouya/kniw/src/data/skill/electricShock';
import { jammer } from '@motojouya/kniw/src/data/skill/jammer';

export const amethystStick: Weapon = {
  name: 'amethystStick',
  label: 'アメジストステッキ',
  skills: [higherBolt, electricShock, jammer],
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
    AirSuitable: 0,
    ThunderSuitable: 10,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(amethystStick, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'アメジストステッキ。雷属性',
};
