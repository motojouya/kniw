import assert from 'assert';
import type { Party } from 'src/domain/party';
import {
  createParty,
  createStore,
  isCharactorDuplicationError,
} from 'src/domain/party';
import {
  createCharactor,
  Charactor,
} from 'src/domain/charactor';
import { isNotWearableErorr } from 'src/domain/acquirement';
import type { Repository } from 'src/io/file_repository'

// export type CreateParty = (name: string, charactors: Charactor[]) => Party | CharactorDuplicationErorr
// export const createParty: CreateParty = (name, charactors) => {
// export function isCharactorDuplicationErorr(obj: any): obj is CharactorDuplicationErorr {
// export const createStore: CreateStore<Party> = storage => {

describe('Party#createParty', function () {
  it('CharactorDuplicationError', function () {
    const charactor01 = (createCharactor('sam', 'human', 'earth', 'steelArmor', 'lightSword') as Charactor);
    const charactor02 = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    const party = createParty('team01', [charactor01, charactor02]);
    assert.equal(isCharactorDuplicationError(party), true);
    if (isCharactorDuplicationError(party)) {
      assert.equal(party.message, 'Partyに同じ名前のキャラクターが存在します');
    } else {
      assert.equal(true, false);
    }
  });
  it('ok', function () {
    const charactor01 = (createCharactor('sam', 'human', 'earth', 'steelArmor', 'lightSword') as Charactor);
    const charactor02 = (createCharactor('john', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    const party = createParty('team01', [charactor01, charactor02]);

    assert.equal(party.name, 'team01');
    assert.equal(party.charactor.length, 2);
    assert.equal(party.charactor[0].name, 'sam');
    assert.equal(party.charactor[1].name, 'john');
  });
});

const storeMock: Repository = {
  save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
  get: (namespace, objctKey) => new Promise((resolve, reject) => resolve({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' })),
  remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
  list: namespace => new Promise((resolve, reject) => resolve(['team01', 'team02'])),
  checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
};

describe('Party#createStore', function () {
  it('save', async () => {
    const store = createStore(storeMock);
    const charactor01 = (createCharactor('sam', 'human', 'earth', 'steelArmor', 'lightSword') as Charactor);
    const charactor02 = (createCharactor('john', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    const party = createParty('team01', [charactor01, charactor02]);
    await store.save(party);
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
    await store.remove('team01');
    assert.equal(true, true);
  });
  it('list', async () => {
    const store = createStore(storeMock);
    const partyList = await store.list();
    assert.equal(partyList.length, 2);
    assert.equal(partyList[0], 'team01');
    assert.equal(partyList[1], 'team02');
  });
});

