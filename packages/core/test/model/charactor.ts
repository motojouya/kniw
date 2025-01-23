import { describe, it } from "node:test";
import assert from "node:assert";

import type { Charactor } from '../../src/model/charactor';
import type { CharactorJson } from '../../src/store_schema/charactor';

import {
  getAbilities,
  getSkills,
  getPhysical,
} from '../../src/model/charactor';
import { toCharactor } from '../../src/store_schema/charactor';
import { NotWearableErorr } from '../../src/model/acquirement';
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from '../../src/store_utility/schema';

describe('Charctor#toCharactor', function () {
  it('DataNotFoundError', function () {
    const charactor = toCharactor({ name: 'sam', race: 'race01', blessing: 'blessing01', clothing: 'clothing01', weapon: 'weapon01', statuses: [], hp: 100, mp: 0, restWt: 120  } as CharactorJson);
    assert.strictEqual(charactor instanceof DataNotFoundError, true);
    if (charactor instanceof DataNotFoundError) {
      assert.strictEqual(charactor.name, 'race01');
      assert.strictEqual(charactor.type, 'race');
      assert.strictEqual(charactor.message, 'race01という種族は存在しません');
    } else {
      assert.strictEqual(true, false);
    }
  });
  it('NotWearableErorr', function () {
    const charactor = toCharactor({ name: 'sam', race: 'fairy', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 } as CharactorJson);
    assert.strictEqual(charactor instanceof NotWearableErorr, true);
    if (charactor instanceof NotWearableErorr) {
      assert.strictEqual(charactor.acquirement.name, 'earth');
      assert.strictEqual(charactor.cause.name, 'fairy');
      assert.strictEqual(charactor.message, 'このキャラクターの設定ではearthを装備できません');
    } else {
      assert.strictEqual(true, false);
    }
  });
  it('ok', function () {
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 } as CharactorJson) as Charactor);
    assert.strictEqual(charactor.name, 'sam');
    assert.strictEqual(charactor.race.name, 'human');
    assert.strictEqual(charactor.blessing.name, 'earth');
    assert.strictEqual(charactor.clothing.name, 'redRobe');
    assert.strictEqual(charactor.weapon.name, 'rubyRod');

    const abilities = getAbilities(charactor);
    assert.strictEqual(abilities.length, 1);
    assert.strictEqual(abilities[0].name, 'mpGainPlus');

    const skills = getSkills(charactor);
    assert.strictEqual(skills.length, 4);
    assert.strictEqual(skills[0].name, 'fireWall');
    assert.strictEqual(skills[1].name, 'flameFall');
    assert.strictEqual(skills[2].name, 'smallHeat');
    assert.strictEqual(skills[3].name, 'ghostFire');

    const physical = getPhysical(charactor);
    assert.strictEqual(physical.MaxHP, 300);
    assert.strictEqual(physical.MaxMP, 200);
    assert.strictEqual(physical.STR, 100);
    assert.strictEqual(physical.VIT, 110);
    assert.strictEqual(physical.DEX, 100);
    assert.strictEqual(physical.AGI, 100);
    assert.strictEqual(physical.AVD, 100);
    assert.strictEqual(physical.INT, 130);
    assert.strictEqual(physical.MND, 120);
    assert.strictEqual(physical.RES, 100);
    assert.strictEqual(physical.WT, 130);
  });
});

