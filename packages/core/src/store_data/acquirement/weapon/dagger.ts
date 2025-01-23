import type { Weapon } from "@motojouya/kniw/src/domain/acquirement";
import { createValidateWearable } from "@motojouya/kniw/src/domain/acquirement";
import { toxicScratch } from "@motojouya/kniw/src/data/skill/toxicScratch";
import { paralysisScratch } from "@motojouya/kniw/src/data/skill/paralysisScratch";
import { silentScratch } from "@motojouya/kniw/src/data/skill/silentScratch";
import { rampartForce } from "@motojouya/kniw/src/data/ability/rampartForce";

export const dagger: Weapon = {
  name: "dagger",
  label: "ダガー",
  skills: [toxicScratch, paralysisScratch, silentScratch],
  abilities: [rampartForce],
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
    const validate = createValidateWearable(dagger, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: "ダガー",
};
