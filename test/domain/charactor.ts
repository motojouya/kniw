import assert from 'assert';

import type { Charactor } from 'src/domain/charactor';
import type { Repository } from 'src/io/file_repository'

import {
  createCharactor,
  getAbilities,
  getSkills,
  getPhysical,
} from 'src/domain/charactor';
import { NotWearableErorr } from 'src/domain/acquirement';
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';

describe('Charctor#createCharactor', function () {
  it('DataNotFoundError', function () {
    const charactor = createCharactor({ name: 'sam', race: 'race01', blessing: 'blessing01', clothing: 'clothing01', weapon: 'weapon01' });
    assert.equal(charactor instanceof DataNotFoundError, true);
    if (charactor instanceof DataNotFoundError) {
      assert.equal(charactor.acquirementName, 'race01');
      assert.equal(charactor.type, 'race');
      assert.equal(charactor.message, 'race01という種族は存在しません');
    } else {
      assert.equal(true, false);
    }
  });
  it('NotWearableErorr', function () {
    const charactor = createCharactor({ name: 'sam', race: 'fairy', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword' });
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
    const charactor = (createCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' }) as Charactor);
    assert.equal(charactor.name, 'sam');
    assert.equal(charactor.race.name, 'human');
    assert.equal(charactor.blessing.name, 'earth');
    assert.equal(charactor.clothing.name, 'fireRobe');
    assert.equal(charactor.weapon.name, 'fireWand');

    const abilities = getAbilities(charactor);
    assert.equal(abilities.length, 1);
    assert.equal(abilities[0].name, 'mpGainPlus');

    const skills = getSkills(charactor);
    assert.equal(skills.length, 1);
    assert.equal(skills[0].name, 'volcanoRise');

    const physical = getPhysical(charactor);
    assert.equal(physical.MaxHP, 100);
    assert.equal(physical.MaxMP, 100);
    assert.equal(physical.STR, 120);
    assert.equal(physical.VIT, 120);
    assert.equal(physical.DEX, 100);
    assert.equal(physical.AGI, 100);
    assert.equal(physical.AVD, 100);
    assert.equal(physical.INT, 110);
    assert.equal(physical.MND, 120);
    assert.equal(physical.RES, 100);
    assert.equal(physical.WT, 115);
  });
});

