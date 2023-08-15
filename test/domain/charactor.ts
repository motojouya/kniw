import assert from 'assert';

import type { Charactor } from 'src/domain/charactor';
import type { Repository } from 'src/io/file_repository'

import {
  toCharactor,
  getAbilities,
  getSkills,
  getPhysical,
} from 'src/domain/charactor';
import { NotWearableErorr } from 'src/domain/acquirement';
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';

describe('Charctor#toCharactor', function () {
  it('DataNotFoundError', function () {
    const charactor = toCharactor({ name: 'sam', race: 'race01', blessing: 'blessing01', clothing: 'clothing01', weapon: 'weapon01', statuses: [], hp: 100, mp: 0, restWt: 120  });
    assert.equal(charactor instanceof DataNotFoundError, true);
    if (charactor instanceof DataNotFoundError) {
      assert.equal(charactor.name, 'race01');
      assert.equal(charactor.type, 'race');
      assert.equal(charactor.message, 'race01という種族は存在しません');
    } else {
      assert.equal(true, false);
    }
  });
  it('NotWearableErorr', function () {
    const charactor = toCharactor({ name: 'sam', race: 'fairy', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 });
    assert.equal(charactor instanceof NotWearableErorr, true);
    if (charactor instanceof NotWearableErorr) {
      assert.equal(charactor.acquirement.name, 'earth');
      assert.equal(charactor.cause.name, 'fairy');
      assert.equal(charactor.message, 'このキャラクターの設定ではearthを装備できません');
    } else {
      assert.equal(true, false);
    }
  });
  it('ok', function () {
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as Charactor);
    assert.equal(charactor.name, 'sam');
    assert.equal(charactor.race.name, 'human');
    assert.equal(charactor.blessing.name, 'earth');
    assert.equal(charactor.clothing.name, 'redRobe');
    assert.equal(charactor.weapon.name, 'rubyRod');

    const abilities = getAbilities(charactor);
    assert.equal(abilities.length, 1);
    assert.equal(abilities[0].name, 'mpGainPlus');

    const skills = getSkills(charactor);
    assert.equal(skills.length, 4);
    assert.equal(skills[0].name, 'fireWall');
    assert.equal(skills[1].name, 'flameFall');
    assert.equal(skills[2].name, 'smallHeat');
    assert.equal(skills[3].name, 'ghostFire');

    const physical = getPhysical(charactor);
    assert.equal(physical.MaxHP, 300);
    assert.equal(physical.MaxMP, 200);
    assert.equal(physical.STR, 100);
    assert.equal(physical.VIT, 110);
    assert.equal(physical.DEX, 100);
    assert.equal(physical.AGI, 100);
    assert.equal(physical.AVD, 100);
    assert.equal(physical.INT, 130);
    assert.equal(physical.MND, 120);
    assert.equal(physical.RES, 100);
    assert.equal(physical.WT, 130);
  });
});

