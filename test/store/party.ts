import assert from 'assert';
import type { Party } from 'src/domain/party';
import { toParty } from 'src/domain/party';
import { createStore } from 'src/store/party';
import type { Repository } from 'src/io/file_repository'

const storeMock: Repository = {
  save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
  get: (namespace, objctKey) => new Promise((resolve, reject) => resolve({
    name: 'team01',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ],
  })),
  remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
  list: namespace => new Promise((resolve, reject) => resolve(['team01', 'team02'])),
  checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
  copy: (namespace, objctKey, fileName) => new Promise((resolve, reject) => resolve(null)),
};

describe('Party#createStore', function () {
  it('save', async () => {
    const store = await createStore(storeMock);
    const party = (toParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);
    await store.save(party);
    assert.equal(true, true);
  });
  it('get', async () => {
    const store = await createStore(storeMock);
    const party = await store.get('team01');
    const typedParty = party as Party;
    if (typedParty) {
      assert.equal(typedParty.name, 'team01');
      const charactors = typedParty.charactors;
      assert.equal(charactors.length, 2);
      assert.equal(charactors[0].name, 'sam');
      assert.equal(charactors[0].race.name, 'human');
      assert.equal(charactors[0].blessing.name, 'earth');
      assert.equal(charactors[0].clothing.name, 'steelArmor');
      assert.equal(charactors[0].weapon.name, 'lightSword');
      assert.equal(charactors[1].name, 'john');
      assert.equal(charactors[1].race.name, 'human');
      assert.equal(charactors[1].blessing.name, 'earth');
      assert.equal(charactors[1].clothing.name, 'fireRobe');
      assert.equal(charactors[1].weapon.name, 'fireWand');
    } else {
      assert.equal(true, false);
    }
  });
  it('remove', async () => {
    const store = await createStore(storeMock);
    await store.remove('team01');
    assert.equal(true, true);
  });
  it('list', async () => {
    const store = await createStore(storeMock);
    const partyList = await store.list();
    assert.equal(partyList.length, 2);
    assert.equal(partyList[0], 'team01');
    assert.equal(partyList[1], 'team02');
  });
});

