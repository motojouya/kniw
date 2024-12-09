import { describe, it } from "node:test";
import assert from "node:assert";

import type { Charactor } from '@motojouya/kniw/src/domain/charactor';
import type { Repository } from '@motojouya/kniw/src/io/repository'
import { toCharactor } from '@motojouya/kniw/src/store/schema/charactor';
import { createStore } from '@motojouya/kniw/src/store/charactor';


const storeMock: Repository = {
  save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
  get: (namespace, objctKey) => new Promise((resolve, reject) => resolve({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 })),
  remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
  list: namespace => new Promise((resolve, reject) => resolve(['sam', 'john'])),
  checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
  exportJson: (namespace, objctKey, fileName) => new Promise((resolve, reject) => resolve(null)),
};

describe('Charctor#createStore', function () {
  it('save', async () => {
    const store = await createStore(storeMock);
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as Charactor);
    await store.save(charactor);
    assert.strictEqual(true, true);
  });
  it('get', async () => {
    const store = await createStore(storeMock);
    const charactor = await store.get('sam');
    const typedCharactor = charactor as Charactor;
    if (typedCharactor) {
      assert.strictEqual(typedCharactor.name, 'sam');
      assert.strictEqual(typedCharactor.race.name, 'human');
      assert.strictEqual(typedCharactor.blessing.name, 'earth');
      assert.strictEqual(typedCharactor.clothing.name, 'redRobe');
      assert.strictEqual(typedCharactor.weapon.name, 'rubyRod');
    } else {
      assert.strictEqual(true, false);
    }
  });
  it('remove', async () => {
    const store = await createStore(storeMock);
    await store.remove('sam');
    assert.strictEqual(true, true);
  });
  it('list', async () => {
    const store = await createStore(storeMock);
    const charactorList = await store.list();
    assert.strictEqual(charactorList.length, 2);
    assert.strictEqual(charactorList[0], 'sam');
    assert.strictEqual(charactorList[1], 'john');
  });
});

