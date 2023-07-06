import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import type { Skill } from 'src/domain/skill';

import assert from 'assert';
import {
  toBattle,
  act,
  stay,
  wait,
  start,
  isSettlement,
  createBattle,
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw
} from 'src/domain/battle';
import { toParty } from 'src/domain/party';
import { toTurn, toAction } from 'src/domain/turn';
import { parse, format } from 'date-fns';

import {
  toCharactor,
  Charactor,
} from 'src/domain/charactor';
import { NotWearableErorr } from 'src/domain/acquirement';
import { CharactorDuplicationError } from 'src/domain/party';
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from 'src/store/store';
import { getSkill } from 'src/store/skill';

const testData = {
  datetime: '2023-06-29T12:12:12',
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

type FormatDate = (date: Date) => string;
const formatDate: FormatDate = date => format(date, "yyyy-MM-dd'T'HH:mm:ss")

describe('Battle#toBattle', function () {
  it('ok', function () {
    const battle = toBattle(testData);

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

    const homeParty = (toParty({ name: 'home', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);
    const visitorParty = (toParty({ name: 'visitor', charactors: [
      { name: 'tom', race: 'lizardman', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword', statuses: [], hp: 100, mp: 0, restWt: 130 },
      { name: 'chang', race: 'werewolf', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand', statuses: [], hp: 100, mp: 0, restWt: 110 },
    ]}) as Party);

    const battle = createBattle(new Date(), homeParty, visitorParty);
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
    assert.equal(turn.sortedCharactors[0].isVisitor, true);
    assert.equal(turn.sortedCharactors[1].name, 'john');
    assert.equal(turn.sortedCharactors[1].isVisitor, false);
    assert.equal(turn.sortedCharactors[2].name, 'sam');
    assert.equal(turn.sortedCharactors[2].isVisitor, false);
    assert.equal(turn.sortedCharactors[3].name, 'tom');
    assert.equal(turn.sortedCharactors[3].isVisitor, true);
  });
});

describe('Battle#act', function () {
  it('ok', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.home.charactors[0]) as Charactor);
    const receiver = (toCharactor(testData.visitor.charactors[0]) as Charactor);
    const skill = (getSkill('chop') as Skill);

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
    assert.equal(turn.sortedCharactors[0].name, 'noa');
    assert.equal(turn.sortedCharactors[1].name, 'sara');

    assert.equal(turn.sortedCharactors[2].name, 'john');
    assert.equal(turn.sortedCharactors[2].hp, 99);
    assert.equal(turn.sortedCharactors[2].restWt, 130);

    assert.equal(turn.sortedCharactors[3].name, 'sam');
    assert.equal(turn.sortedCharactors[3].hp, 100);
    assert.equal(turn.sortedCharactors[3].restWt, 220);
  });
});

describe('Battle#stay', function () {
  it('ok', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.home.charactors[0]) as Charactor);

    const turn = stay(battle, actor, new Date());

    assert.equal(turn.action.type, 'DO_NOTHING');
    if (turn.action.type === 'DO_NOTHING') {
      assert.equal(turn.action.actor.name, 'sam');
    } else {
      assert.equal(true, false);
    }

    assert.equal(turn.field.climate, 'SUNNY');
    assert.equal(turn.sortedCharactors.length, 4);
    assert.equal(turn.sortedCharactors[0].name, 'noa');
    assert.equal(turn.sortedCharactors[1].name, 'sara');
    assert.equal(turn.sortedCharactors[2].name, 'sam');
    assert.equal(turn.sortedCharactors[3].name, 'john');
  });
});

describe('Battle#wait', function () {
  it('ok', function () {
    const battle = (toBattle(testData) as Battle);

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
    assert.equal(turn.sortedCharactors[2].restWt, 15);
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
    const battle = (toBattle(testData) as Battle);
    const gameResult = isSettlement(battle);
    assert.equal(gameResult, GameOngoing);
  });
  it('GameHome', function () {
    const data = {
      ...testData,
      turns: [
        {
          ...(testData.turns[0]),
          sortedCharactors: [
            { ...(testData.turns[0].sortedCharactors[0]) },
            { ...(testData.turns[0].sortedCharactors[1]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[2]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[3]), hp: 0 },
          ],
        }
      ],
    };

    const battle = (toBattle(data) as Battle);
    const gameResult = isSettlement(battle);
    assert.equal(gameResult, GameHome);
  });
  it('GameVisitor', function () {
    const data = {
      ...testData,
      turns: [
        {
          ...(testData.turns[0]),
          sortedCharactors: [
            { ...(testData.turns[0].sortedCharactors[0]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[1]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[2]) },
            { ...(testData.turns[0].sortedCharactors[3]), hp: 0 },
          ],
        }
      ],
    };

    const battle = (toBattle(data) as Battle);
    const gameResult = isSettlement(battle);
    assert.equal(gameResult, GameVisitor);
  });
  it('GameDraw', function () {
    const data = {
      ...testData,
      turns: [
        {
          ...(testData.turns[0]),
          sortedCharactors: [
            { ...(testData.turns[0].sortedCharactors[0]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[1]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[2]), hp: 0 },
            { ...(testData.turns[0].sortedCharactors[3]), hp: 0 },
          ],
        }
      ],
    };

    const battle = (toBattle(data) as Battle);
    const gameResult = isSettlement(battle);
    assert.equal(gameResult, GameDraw);
  });
});

