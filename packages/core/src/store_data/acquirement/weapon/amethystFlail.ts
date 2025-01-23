import type { Weapon } from "@motojouya/kniw/src/domain/acquirement";
import { createValidateWearable } from "@motojouya/kniw/src/domain/acquirement";
import { blow } from "@motojouya/kniw/src/data/skill/blow";
import { dazzle } from "@motojouya/kniw/src/data/skill/dazzle";
import { higherBolt } from "@motojouya/kniw/src/data/skill/higherBolt";
import { rampartForce } from "@motojouya/kniw/src/data/ability/rampartForce";

export const amethystFlail: Weapon = {
  name: "amethystFlail",
  label: "アメジストフレイル",
  skills: [blow, higherBolt, dazzle],
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
    AirSuitable: 0,
    ThunderSuitable: 10,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(amethystFlail, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: "アメジストフレイル。雷属性",
};
