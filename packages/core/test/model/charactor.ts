import { describe, it, expect } from 'vitest'

import type { Charactor } from "../../src/model/charactor";
import type { CharactorJson } from "../../src/store_schema/charactor";

import { getAbilities, getSkills, getPhysical } from "../../src/model/charactor";
import { toCharactor } from "../../src/store_schema/charactor";
import { NotWearableErorr } from "../../src/model/acquirement";
import { DataNotFoundError } from "../../src/store_utility/schema";

describe("Charctor#toCharactor", function () {
  it("DataNotFoundError", function () {
    const charactor = toCharactor({
      name: "sam",
      race: "race01",
      blessing: "blessing01",
      clothing: "clothing01",
      weapon: "weapon01",
      statuses: [],
      hp: 100,
      mp: 0,
      restWt: 120,
    } as CharactorJson);
    expect(charactor instanceof DataNotFoundError, true);
    if (charactor instanceof DataNotFoundError) {
      expect(charactor.name, "race01");
      expect(charactor.type, "race");
      expect(charactor.message, "race01という種族は存在しません");
    } else {
      expect(true, false);
    }
  });
  it("NotWearableErorr", function () {
    const charactor = toCharactor({
      name: "sam",
      race: "fairy",
      blessing: "earth",
      clothing: "steelArmor",
      weapon: "swordAndShield",
      statuses: [],
      hp: 100,
      mp: 0,
      restWt: 120,
    } as CharactorJson);
    expect(charactor instanceof NotWearableErorr, true);
    if (charactor instanceof NotWearableErorr) {
      expect(charactor.acquirement.name, "earth");
      expect(charactor.cause.name, "fairy");
      expect(charactor.message, "このキャラクターの設定ではearthを装備できません");
    } else {
      expect(true, false);
    }
  });
  it("ok", function () {
    const charactor = toCharactor({
      name: "sam",
      race: "human",
      blessing: "earth",
      clothing: "redRobe",
      weapon: "rubyRod",
      statuses: [],
      hp: 100,
      mp: 0,
      restWt: 115,
    } as CharactorJson) as Charactor;
    expect(charactor.name, "sam");
    expect(charactor.race.name, "human");
    expect(charactor.blessing.name, "earth");
    expect(charactor.clothing.name, "redRobe");
    expect(charactor.weapon.name, "rubyRod");

    const abilities = getAbilities(charactor);
    expect(abilities.length, 1);
    expect(abilities[0].name, "mpGainPlus");

    const skills = getSkills(charactor);
    expect(skills.length, 4);
    expect(skills[0].name, "fireWall");
    expect(skills[1].name, "flameFall");
    expect(skills[2].name, "smallHeat");
    expect(skills[3].name, "ghostFire");

    const physical = getPhysical(charactor);
    expect(physical.MaxHP, 300);
    expect(physical.MaxMP, 200);
    expect(physical.STR, 100);
    expect(physical.VIT, 110);
    expect(physical.DEX, 100);
    expect(physical.AGI, 100);
    expect(physical.AVD, 100);
    expect(physical.INT, 130);
    expect(physical.MND, 120);
    expect(physical.RES, 100);
    expect(physical.WT, 130);
  });
});
