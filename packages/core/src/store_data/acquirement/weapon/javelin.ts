import type { Weapon } from "@motojouya/kniw/src/domain/acquirement";
import { createValidateWearable } from "@motojouya/kniw/src/domain/acquirement";
import { stab } from "@motojouya/kniw/src/data/skill/stab";
import { overbear } from "@motojouya/kniw/src/data/skill/overbear";
import { blindBull } from "@motojouya/kniw/src/data/skill/blindBull";
import { rampartForce } from "@motojouya/kniw/src/data/ability/rampartForce";

export const javelin: Weapon = {
  name: "javelin",
  label: "ジャベリン",
  skills: [stab, blindBull, overbear],
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
    const validate = createValidateWearable(javelin, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: "ジャベリン。刺突武器",
};
