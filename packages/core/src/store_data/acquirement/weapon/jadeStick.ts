import type { Weapon } from "../../../model/acquirement";
import { createValidateWearable } from "../../../model/acquirement";
import { hailstone } from "@motojouya/kniw/src/data/skill/hailstone";
import { iceSandwich } from "@motojouya/kniw/src/data/skill/iceSandwich";
import { cumulonimbus } from "@motojouya/kniw/src/data/skill/cumulonimbus";

export const jadeStick: Weapon = {
  name: "jadeStick",
  label: "ヒスイステッキ",
  skills: [hailstone, iceSandwich, cumulonimbus],
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
    IceSuitable: 10,
    AirSuitable: 0,
    ThunderSuitable: 0,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(jadeStick, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: "ヒスイステッキ。氷属性",
};
