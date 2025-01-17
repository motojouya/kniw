import type { Weapon } from "@motojouya/kniw/src/domain/acquirement";
import { createValidateWearable } from "@motojouya/kniw/src/domain/acquirement";
import { blow } from "@motojouya/kniw/src/data/skill/blow";
import { dazzle } from "@motojouya/kniw/src/data/skill/dazzle";
import { gravelWall } from "@motojouya/kniw/src/data/skill/gravelWall";
import { rampartForce } from "@motojouya/kniw/src/data/ability/rampartForce";

export const morningStar: Weapon = {
  name: "morningStar",
  label: "モーニングスター",
  skills: [blow, gravelWall, dazzle],
  abilities: [rampartForce],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 30,
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
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(morningStar, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: "モーニングスター。打撃武器",
};
