import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import type { Skill } from 'src/domain/skill';

import assert from 'assert';
import {
  createBattle,
  act,
  stay,
  wait,
  start,
  isSettlement,
  newBattle,
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw
} from 'src/domain/battle';
import { createParty } from 'src/domain/party';
import { parse, format } from 'date-fns';

import {
  createCharactor,
  Charactor,
} from 'src/domain/charactor';
import { NotWearableErorr } from 'src/domain/acquirement';
import { CharactorDuplicationError } from 'src/domain/party';
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';
import { createSkill } from 'src/store/skill';

export const testData = {
  datetime: '2023-06-29T12:12:12',
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', isVisitor: false },
      { name: 'sara', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', isVisitor: false },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', isVisitor: true },
      { name: 'noa', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', isVisitor: true },
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
        { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', isVisitor: false },
        { name: 'sara', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', isVisitor: false },
        { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', isVisitor: true },
        { name: 'noa', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', isVisitor: true },
      ],
      field: {
        climate: 'SUNNY',
      },
    }
  ],
  result: GameOngoing,
};

type FormatDate = (date: Date) => string;
const formatDate: FormatDate = date => format(date, "yyyy-MM-dd'T'HH:mm:ss")

describe('Battle#createBattle', function () {
  it('ok', function () {
    const battle = createBattle(testData);

    if (battle instanceof NotWearableErorr
     || battle instanceof DataNotFoundError
     || battle instanceof CharactorDuplicationError
     || battle instanceof JsonSchemaUnmatchError
    ) {
      assert.equal(true, false);
    } else {
      assert.equal(formatDate(battle.datetime), '2023-06-29T12:12:12');
      assert.equal(battle.home.name, 'home');
      assert.equal(battle.visitor.name, 'visitor');
      assert.equal(battle.turns.length, 1);
      assert.equal(formatDate(battle.turns[0].datetime), '2023-06-29T12:12:21');
      assert.equal(battle.result, GameOngoing);
    }
  });
});

describe('Battle#start', function () {
  it('ok', function () {

    const homeParty = (createParty({ name: 'home', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);
    const visitorParty = (createParty({ name: 'visitor', charactors: [
      { name: 'tom', race: 'lizardman', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'chang', race: 'werewolf', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);

    const battle = newBattle(new Date(), homeParty, visitorParty);
    assert.equal(battle.result, GameOngoing);

    const turn = start(battle, new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.equal(turn.action.type, 'TIME_PASSING');
    if (turn.action.type === 'TIME_PASSING') {
      assert.equal(turn.action.wt, 0);
    } else {
      assert.equal(true, false);
    }

    assert.equal(turn.field.climate, 'SUNNY');
    assert.equal(turn.sortedCharactors.length, 4);
    assert.equal(turn.sortedCharactors[0].name, 'chang');
    assert.equal(turn.sortedCharactors[1].name, 'john');
    assert.equal(turn.sortedCharactors[2].name, 'sam');
    assert.equal(turn.sortedCharactors[3].name, 'tom');
  });
});

describe('Battle#act', function () {
  it('ok', function () {
    const battle = (createBattle(testData) as Battle);
    const actor = (createCharactor(testData.home.charactors[0]) as Charactor);
    const receiver = (createCharactor(testData.visitor.charactors[0]) as Charactor);
    const skill = (createSkill('chop') as Skill);

    const turn = act(battle, actor, skill, [receiver], new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.equal(turn.action.type, 'DO_SKILL');
    if (turn.action.type === 'DO_SKILL') {
      assert.equal(turn.action.actor.name, 'sam');
      assert.equal(turn.action.skill.name, 'chop');
      assert.equal(turn.action.receivers.length, 1);
      assert.equal(turn.action.receivers[0].name, 'john');
    } else {
      assert.equal(true, false);
    }

    assert.equal(turn.field.climate, 'SUNNY');
    assert.equal(turn.sortedCharactors.length, 4);
    assert.equal(turn.sortedCharactors[0].name, 'sara');
    assert.equal(turn.sortedCharactors[1].name, 'noa');

    assert.equal(turn.sortedCharactors[2].name, 'john');
    assert.equal(turn.sortedCharactors[2].hp, 99);
    assert.equal(turn.sortedCharactors[2].restWt, 120);

    assert.equal(turn.sortedCharactors[3].name, 'sam');
    assert.equal(turn.sortedCharactors[3].hp, 100);
    assert.equal(turn.sortedCharactors[3].restWt, 220);
  });
});

describe('Battle#stay', function () {
  it('ok', function () {
    const battle = (createBattle(testData) as Battle);
    const actor = (createCharactor(testData.home.charactors[0]) as Charactor);

    const turn = stay(battle, actor, new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.equal(turn.action.type, 'DO_NOTHING');
    if (turn.action.type === 'DO_NOTHING') {
      assert.equal(turn.action.actor.name, 'sam');
    } else {
      assert.equal(true, false);
    }

    assert.equal(turn.field.climate, 'SUNNY');
    assert.equal(turn.sortedCharactors.length, 4);
    assert.equal(turn.sortedCharactors[0].name, 'sara');
    assert.equal(turn.sortedCharactors[1].name, 'noa');
    assert.equal(turn.sortedCharactors[2].name, 'sam');
    assert.equal(turn.sortedCharactors[3].name, 'john');
  });
});

describe('Battle#wait', function () {
  it('ok', function () {
    const battle = (createBattle(testData) as Battle);

    const turn = wait(battle, 115, new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.equal(turn.action.type, 'TIME_PASSING');
    if (turn.action.type === 'TIME_PASSING') {
      assert.equal(turn.action.wt, 115);
    } else {
      assert.equal(true, false);
    }

    assert.equal(turn.field.climate, 'SUNNY');
    assert.equal(turn.sortedCharactors.length, 4);
    assert.equal(turn.sortedCharactors[0].name, 'sam');
    assert.equal(turn.sortedCharactors[0].restWt, 5);
    assert.equal(turn.sortedCharactors[1].name, 'sara');
    assert.equal(turn.sortedCharactors[1].restWt, 0);
    assert.equal(turn.sortedCharactors[2].name, 'john');
    assert.equal(turn.sortedCharactors[2].restWt, 5);
    assert.equal(turn.sortedCharactors[3].name, 'noa');
    assert.equal(turn.sortedCharactors[3].restWt, 0);
  });
});

// export type IsSettlement = (battle: Battle) => GameResult;
// export const isSettlement: IsSettlement = battle => {
// return GameDraw;
// return GameHome;
// return GameVisitor;
// return GameOngoing;
describe('Battle#isSettlement', function () {
  it('GameOngoing', function () {
    const battle = (createBattle(testData) as Battle);

    const gameResult = isSettlement(battle);

    assert.equal(gameResult, 'GameOngoing');
  });
});

