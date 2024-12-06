import { describe, it } from "node:test";
import assert from "node:assert";

import type { Repository } from 'src/io/repository'
import type { Battle } from 'src/domain/battle';
import {
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw
} from 'src/domain/battle';
import { toBattle } from 'src/store/schema/battle';
import { createStore } from 'src/store/battle';
import { parse, format } from 'date-fns';

const testData = {
  title: 'first-title',
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
      { name: 'sara', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: false },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: true },
      { name: 'noa', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: true },
    ],
  },
  turns: [
    {
      datetime: '2023-06-29T12:12:21',
      action: {
        type: 'TIME_PASSING',
        wt: 0,
      },
      sortedCharactors: [
        { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
        { name: 'sara', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: false },
        { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: true },
        { name: 'noa', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: true },
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
  exportJson: (namespace, objctKey, fileName) => new Promise((resolve, reject) => resolve(null)),
};


type FormatDate = (date: Date) => string;
const formatDate: FormatDate = date => format(date, "yyyy-MM-dd'T'HH:mm:ss")

describe('Battle#createStore', function () {
  it('save', async () => {
    const store = await createStore(storeMock);
    const battle = (toBattle(testData) as Battle);
    await store.save(battle);
    assert.strictEqual(true, true);
  });
  it('get', async () => {
    const store = await createStore(storeMock);
    const battle = await store.get('2023-06-29T12:12:12');
    const typedBattle = battle as Battle;
    if (typedBattle) {
      assert.strictEqual(typedBattle.title, 'first-title');

      const home = typedBattle.home;
      assert.strictEqual(home.name, 'home');
      assert.strictEqual(home.charactors.length, 2);
      assert.strictEqual(home.charactors[0].name, 'sam');
      assert.strictEqual(home.charactors[1].name, 'sara');

      const visitor = typedBattle.visitor;
      assert.strictEqual(visitor.name, 'visitor');
      assert.strictEqual(visitor.charactors.length, 2);
      assert.strictEqual(visitor.charactors[0].name, 'john');
      assert.strictEqual(visitor.charactors[1].name, 'noa');

      const turns = typedBattle.turns;
      assert.strictEqual(turns.length, 1);
      assert.strictEqual(formatDate(turns[0].datetime), '2023-06-29T12:12:21');
      if (turns[0].action.type === 'TIME_PASSING') {
        assert.strictEqual(turns[0].action.type, 'TIME_PASSING');
        assert.strictEqual(turns[0].action.wt, 0);
      } else {
        assert.strictEqual(true, false);
      }

      assert.strictEqual(turns[0].sortedCharactors.length, 4);
      assert.strictEqual(turns[0].sortedCharactors[0].name, 'sam');
      assert.strictEqual(turns[0].sortedCharactors[1].name, 'sara');
      assert.strictEqual(turns[0].sortedCharactors[2].name, 'john');
      assert.strictEqual(turns[0].sortedCharactors[3].name, 'noa');

      assert.strictEqual(turns[0].field.climate, 'SUNNY');

      assert.strictEqual(typedBattle.result, GameOngoing);
    } else {
      assert.strictEqual(true, false);
    }
  });
  it('remove', async () => {
    const store = await createStore(storeMock);
    await store.remove('2023-06-29T12:12:12');
    assert.strictEqual(true, true);
  });
  it('list', async () => {
    const store = await createStore(storeMock);
    const battleList = await store.list();
    assert.strictEqual(battleList.length, 2);
    assert.strictEqual(battleList[0], '2023-06-29T12:12:12');
    assert.strictEqual(battleList[1], '2023-06-29T15:15:15');
  });
});

