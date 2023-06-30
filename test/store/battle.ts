import assert from 'assert';
import type { Repository } from 'src/io/file_repository'
import type { Battle } from 'src/domain/battle';
import {
  createBattle,
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw
} from 'src/domain/battle';
import { createStore } from 'src/store/battle';
import { parse } from 'date-fns';

export const testData = {
  datetime: parse('2023-06-29T12:12:12', 'yyyy-MM-ddTHH:mm:ss', new Date()),
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword' },
      { name: 'sara', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword' },
      { name: 'noa', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' },
    ],
  },
  turns: [
    {
      datetime: parse('2023-06-29T12:12:21', 'yyyy-MM-ddTHH:mm:ss', new Date()),
      action: {
        type: 'TIME_PASSING',
        wt: 0,
      },
      sortedCharactors: [
        { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword' },
        { name: 'sara', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' },
        { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword' },
        { name: 'noa', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' },
      ],
      field: {
        climate: 'SUNNY',
      },
    }
  ],
  result: GameOngoing,
};

const storeMock: Repository = {
  save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
  get: (namespace, objctKey) => new Promise((resolve, reject) => resolve(testData)),
  remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
  list: namespace => new Promise((resolve, reject) => resolve(['2023-06-29T12:12:12', '2023-06-29T15:15:15'])),
  checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
};

describe('Battle#createStore', function () {
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

