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
    const party = (createParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);
    assert.equal(isCharactorDuplicationError(party), true);
    if (isCharactorDuplicationError(party)) {
      assert.equal(party.message, 'Partyに同じ名前のキャラクターが存在します');
    } else {
      assert.equal(true, false);
    }
  });
  it('ok', function () {
    const party = (createParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);

    assert.equal(party.name, 'team01');
    assert.equal(party.charactors.length, 2);
    assert.equal(party.charactors[0].name, 'sam');
    assert.equal(party.charactors[1].name, 'john');
  });
});

const storeMock: Repository = {
  save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
  get: (namespace, objctKey) => new Promise((resolve, reject) => resolve({
    name: 'team01',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword' },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' },
    ],
  })),
  remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
  list: namespace => new Promise((resolve, reject) => resolve(['team01', 'team02'])),
  checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
};

describe('Party#createStore', function () {
  it('save', async () => {
    const store = createStore(storeMock);
    const party = (createParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);
    await store.save(party);
    assert.equal(true, true);
  });
  it('get', async () => {
    const store = createStore(storeMock);
    const party = await store.get('team01');
    if (party) {
      assert.equal(party.name, 'team01');
      const charactors = party.charactors;
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

