import assert from 'assert';
import type { Charactor } from 'src/domain/charactor';
import { createCharactor } from 'src/domain/charactor';
import { createStore } from 'src/store/charactor';
import type { Repository } from 'src/io/file_repository'


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
    const charactor = (createCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' }) as Charactor);
    await store.save(charactor);
    assert.equal(true, true);
  });
  it('get', async () => {
    const store = createStore(storeMock);
    const charactor = await store.get('sam');
    const typedCharactor = charactor as Charactor;
    if (typedCharactor) {
      assert.equal(typedCharactor.name, 'sam');
      assert.equal(typedCharactor.race.name, 'human');
      assert.equal(typedCharactor.blessing.name, 'earth');
      assert.equal(typedCharactor.clothing.name, 'fireRobe');
      assert.equal(typedCharactor.weapon.name, 'fireWand');
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

