import assert from 'assert';
import {
  createCharactor,
  isAcquirementNotFoundError,
  createStore,
  getAbilities,
  getSkills,
  getPhysical,
  Charactor,
} from 'src/domain/charactor';
import { isNotWearableErorr } from 'src/domain/acquirement';
import type { Repository } from 'src/io/file_repository'

// export const createStorage: CreateStore<Charactor> = storage => {

describe('Charctor#createCharactor', function () {
  it('AcquirementNotFoundError', function () {
    const charactor = createCharactor('sam', 'race01', 'blessing01', 'clothing01', 'weapon01');
    assert.equal(isAcquirementNotFoundError(charactor), true);
    if (isAcquirementNotFoundError(charactor)) {
      assert.equal(charactor.acquirementName, 'race01');
      assert.equal(charactor.type, 'race');
      assert.equal(charactor.message, 'race01という種族は存在しません');
    } else {
      assert.equal(true, false);
    }
  });
  it('NotWearableErorr', function () {
    const charactor = createCharactor('sam', 'fairy', 'earth', 'steelArmor', 'lightSword');
    assert.equal(isNotWearableErorr(charactor), true);
    if (isNotWearableErorr(charactor)) {
      assert.equal(charactor.acquirement.name, 'earth');
      assert.equal(charactor.cause.name, 'fairy');
      assert.equal(charactor.message, 'このキャラクターの設定ではearthを装備できません');
    } else {
      assert.equal(true, false);
    }
  });
  it('ok', function () {
    const charactor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
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
    assert.equal(physical.WT, 110);
  });
});

const storeMock: Repository = {
  save: (namespace, objctKey, obj) => new Promise((result, reject) => {}),
  get: (namespace, objctKey) => new Promise((result, reject) => ({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' })),
  remove: (namespace, objctKey) => new Promise((result, reject) => {}),
  list: namespace => new Promise((result, reject) => (['sam', 'john'])),
  checkNamespace: namespace => new Promise((result, reject) => {}),
};

describe('Charctor#createStore', function () {
  it('save', async function (done) {
    const store = createStore(storeMock);
    const charactor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    await store.save(charactor);
    assert.equal(true, true);
    done();
    //TODO mockの中でパラメータチェックしたほうがいいかも
  });
});

