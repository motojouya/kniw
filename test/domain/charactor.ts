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
  save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
  get: (namespace, objctKey) => new Promise((resolve, reject) => resolve({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' })),
  remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
  list: namespace => new Promise((resolve, reject) => resolve(['sam', 'john'])),
  checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
};

describe('Charctor#createStore', function () {
  it('save', async () => {
    const store = createStore(storeMock);
    const charactor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    await store.save(charactor);
    assert.equal(true, true);
  });
  it('get', async () => {
    const store = createStore(storeMock);
    const charactor = await store.get('sam');
    if (charactor) {
      assert.equal(charactor.name, 'sam');
      assert.equal(charactor.race.name, 'human');
      assert.equal(charactor.blessing.name, 'earth');
      assert.equal(charactor.clothing.name, 'fireRobe');
      assert.equal(charactor.weapon.name, 'fireWand');
    } else {
      assert.equal(true, false);
    }
  });
  it('remove', async () => {
    const store = createStore(storeMock);
    await store.remove('sam');
    assert.equal(true, true);
  });
  it('list', async () => {
    const store = createStore(storeMock);
    const charactorList = await store.list();
    assert.equal(charactorList.length, 2);
    assert.equal(charactorList[0], 'sam');
    assert.equal(charactorList[1], 'john');
  });
});

