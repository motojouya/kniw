import type { Weapon } from "../../../model/acquirement";
import { createValidateWearable } from "../../../model/acquirement";
import { gunStone } from "@motojouya/kniw/src/data/skill/gunStone";
import { mountFall } from "@motojouya/kniw/src/data/skill/mountFall";
import { stoneWeather } from "@motojouya/kniw/src/data/skill/stoneWeather";

export const diamondStaff: Weapon = {
  name: "diamondStaff",
  label: "ダイヤモンドスタッフ",
  skills: [gunStone, mountFall, stoneWeather],
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
    RockSuitable: 10,
    WaterSuitable: 0,
    IceSuitable: 0,
    AirSuitable: 0,
    ThunderSuitable: 0,
    move: 0,
    jump: 0,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(diamondStaff, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: "ダイヤモンドスタッフ。岩属性",
};
