import assert from 'assert';
import type { Repository } from 'src/io/file_repository'
import type { Battle } from 'src/domain/battle';
import {
  toBattle,
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw
} from 'src/domain/battle';
import { createStore } from 'src/store/battle';
import { parse, format } from 'date-fns';

const testData = {
  title: 'first-title',
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
      { name: 'sara', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: false },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: true },
      { name: 'noa', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: true },
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
        { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
        { name: 'sara', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: false },
        { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: true },
        { name: 'noa', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: true },
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
  copy: (namespace, objctKey, fileName) => new Promise((resolve, reject) => resolve(null)),
};


type FormatDate = (date: Date) => string;
const formatDate: FormatDate = date => format(date, "yyyy-MM-dd'T'HH:mm:ss")

describe('Battle#createStore', function () {
  it('save', async () => {
    const store = await createStore(storeMock);
    const battle = (toBattle(testData) as Battle);
    await store.save(battle);
    assert.equal(true, true);
  });
  it('get', async () => {
    const store = await createStore(storeMock);
    const battle = await store.get('2023-06-29T12:12:12');
    const typedBattle = battle as Battle;
    if (typedBattle) {
      assert.equal(typedBattle.title, 'first-title');

      const home = typedBattle.home;
      assert.equal(home.name, 'home');
      assert.equal(home.charactors.length, 2);
      assert.equal(home.charactors[0].name, 'sam');
      assert.equal(home.charactors[1].name, 'sara');

      const visitor = typedBattle.visitor;
      assert.equal(visitor.name, 'visitor');
      assert.equal(visitor.charactors.length, 2);
      assert.equal(visitor.charactors[0].name, 'john');
      assert.equal(visitor.charactors[1].name, 'noa');

      const turns = typedBattle.turns;
      assert.equal(turns.length, 1);
      assert.equal(formatDate(turns[0].datetime), '2023-06-29T12:12:21');
      if (turns[0].action.type === 'TIME_PASSING') {
        assert.equal(turns[0].action.type, 'TIME_PASSING');
        assert.equal(turns[0].action.wt, 0);
      } else {
        assert.equal(true, false);
      }

      assert.equal(turns[0].sortedCharactors.length, 4);
      assert.equal(turns[0].sortedCharactors[0].name, 'sam');
      assert.equal(turns[0].sortedCharactors[1].name, 'sara');
      assert.equal(turns[0].sortedCharactors[2].name, 'john');
      assert.equal(turns[0].sortedCharactors[3].name, 'noa');

      assert.equal(turns[0].field.climate, 'SUNNY');

      assert.equal(typedBattle.result, GameOngoing);
    } else {
      assert.equal(true, false);
    }
  });
  it('remove', async () => {
    const store = await createStore(storeMock);
    await store.remove('2023-06-29T12:12:12');
    assert.equal(true, true);
  });
  it('list', async () => {
    const store = await createStore(storeMock);
    const battleList = await store.list();
    assert.equal(battleList.length, 2);
    assert.equal(battleList[0], '2023-06-29T12:12:12');
    assert.equal(battleList[1], '2023-06-29T15:15:15');
  });
});

