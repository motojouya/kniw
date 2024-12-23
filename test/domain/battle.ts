import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Skill } from '@motojouya/kniw/src/domain/skill';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { BattleJson } from '@motojouya/kniw/src/store/schema/battle';

import { describe, it } from "node:test";
import assert from "node:assert";

import {
  actToCharactor,
  actToField,
  stay,
  wait,
  start,
  isSettlement,
  createBattle,
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw,
  NotBattlingError,
} from '@motojouya/kniw/src/domain/battle';
import { toBattle } from '@motojouya/kniw/src/store/schema/battle';
import { toParty } from '@motojouya/kniw/src/store/schema/party';
import { toTurn, toAction } from '@motojouya/kniw/src/store/schema/turn';
import { parse, format } from 'date-fns';

import { toCharactor } from '@motojouya/kniw/src/store/schema/charactor';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import {
  JsonSchemaUnmatchError,
  DataNotFoundError,
} from '@motojouya/kniw/src/store/store';
import { skillRepository } from '@motojouya/kniw/src/store/skill';

const testData = {
  title: 'first-title',
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 100, restWt: 120, isVisitor: false },
      { name: 'sara', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 100, restWt: 115, isVisitor: false },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 100, restWt: 130, isVisitor: true },
      { name: 'noa', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 100, restWt: 110, isVisitor: true },
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
        { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 100, restWt: 120, isVisitor: false },
        { name: 'sara', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 100, restWt: 115, isVisitor: false },
        { name: 'john', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 100, restWt: 130, isVisitor: true },
        { name: 'noa', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 100, restWt: 110, isVisitor: true },
      ],
      field: {
        climate: 'SUNNY',
      },
    }
  ],
  result: GameOngoing,
} as BattleJson;

type FormatDate = (date: Date) => string;
const formatDate: FormatDate = date => format(date, "yyyy-MM-dd'T'HH:mm:ss")

describe('Battle#toBattle', function () {
  it('ok', function () {
    const battle = toBattle(testData);

    if (battle instanceof NotWearableErorr
     || battle instanceof DataNotFoundError
     || battle instanceof CharactorDuplicationError
     || battle instanceof JsonSchemaUnmatchError
     || battle instanceof NotBattlingError
    ) {
      assert.strictEqual(true, false);
    } else {
      assert.strictEqual(battle.title, 'first-title');
      assert.strictEqual(battle.home.name, 'home');
      assert.strictEqual(battle.visitor.name, 'visitor');
      assert.strictEqual(battle.turns.length, 1);
      assert.strictEqual(formatDate(battle.turns[0].datetime), '2023-06-29T12:12:21');
      assert.strictEqual(battle.result, GameOngoing);
    }
  });
});

describe('Battle#start', function () {
  it('ok', function () {

    const homeParty = (toParty({ name: 'home', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);
    const visitorParty = (toParty({ name: 'visitor', charactors: [
      { name: 'tom', race: 'lizardman', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 130 },
      { name: 'chang', race: 'werewolf', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 110 },
    ]}) as Party);

    const battle = createBattle('first-title', homeParty, visitorParty);
    assert.strictEqual(battle.result, GameOngoing);

    const turn = start(battle, new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.strictEqual(turn.action.type, 'TIME_PASSING');
    if (turn.action.type === 'TIME_PASSING') {
      assert.strictEqual(turn.action.wt, 0);
    } else {
      assert.strictEqual(true, false);
    }

    assert.strictEqual(turn.field.climate, 'SUNNY');
    assert.strictEqual(turn.sortedCharactors.length, 4);
    assert.strictEqual(turn.sortedCharactors[0].name, 'chang');
    assert.strictEqual(turn.sortedCharactors[0].isVisitor, true);
    assert.strictEqual(turn.sortedCharactors[1].name, 'john');
    assert.strictEqual(turn.sortedCharactors[1].isVisitor, false);
    assert.strictEqual(turn.sortedCharactors[2].name, 'sam');
    assert.strictEqual(turn.sortedCharactors[2].isVisitor, false);
    assert.strictEqual(turn.sortedCharactors[3].name, 'tom');
    assert.strictEqual(turn.sortedCharactors[3].isVisitor, true);
  });
});

describe('Battle#act', function () {
  it('charactor', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.home.charactors[0]) as CharactorBattling);
    const receiver = (toCharactor(testData.visitor.charactors[0]) as CharactorBattling);
    const skill = (skillRepository.get('chop') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.strictEqual(turn.action.type, 'DO_SKILL');
    if (turn.action.type === 'DO_SKILL') {
      assert.strictEqual(turn.action.actor.name, 'sam');
      assert.strictEqual(turn.action.skill.name, 'chop');
      assert.strictEqual(turn.action.receivers.length, 1);
      assert.strictEqual(turn.action.receivers[0].name, 'john');
    } else {
      assert.strictEqual(true, false);
    }

    assert.strictEqual(turn.field.climate, 'SUNNY');
    assert.strictEqual(turn.sortedCharactors.length, 4);
    assert.strictEqual(turn.sortedCharactors[0].name, 'noa');
    assert.strictEqual(turn.sortedCharactors[1].name, 'sara');

    assert.strictEqual(turn.sortedCharactors[2].name, 'john');
    assert.strictEqual(turn.sortedCharactors[2].hp, 54);
    assert.strictEqual(turn.sortedCharactors[2].restWt, 130);

    assert.strictEqual(turn.sortedCharactors[3].name, 'sam');
    assert.strictEqual(turn.sortedCharactors[3].hp, 100);
    assert.strictEqual(turn.sortedCharactors[3].restWt, 240);
  });
});

describe('Battle#stay', function () {
  it('ok', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.home.charactors[0]) as CharactorBattling);

    const turn = stay(battle, actor, new Date());

    assert.strictEqual(turn.action.type, 'DO_NOTHING');
    if (turn.action.type === 'DO_NOTHING') {
      assert.strictEqual(turn.action.actor.name, 'sam');
    } else {
      assert.strictEqual(true, false);
    }

    assert.strictEqual(turn.field.climate, 'SUNNY');
    assert.strictEqual(turn.sortedCharactors.length, 4);
    assert.strictEqual(turn.sortedCharactors[0].name, 'noa');
    assert.strictEqual(turn.sortedCharactors[1].name, 'sara');
    assert.strictEqual(turn.sortedCharactors[2].name, 'john');
    assert.strictEqual(turn.sortedCharactors[3].name, 'sam');
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

    assert.strictEqual(turn.action.type, 'TIME_PASSING');
    if (turn.action.type === 'TIME_PASSING') {
      assert.strictEqual(turn.action.wt, 115);
    } else {
      assert.strictEqual(true, false);
    }

    assert.strictEqual(turn.field.climate, 'SUNNY');
    assert.strictEqual(turn.sortedCharactors.length, 4);
    assert.strictEqual(turn.sortedCharactors[0].name, 'sam');
    assert.strictEqual(turn.sortedCharactors[0].restWt, 5);
    assert.strictEqual(turn.sortedCharactors[1].name, 'sara');
    assert.strictEqual(turn.sortedCharactors[1].restWt, 0);
    assert.strictEqual(turn.sortedCharactors[2].name, 'john');
    assert.strictEqual(turn.sortedCharactors[2].restWt, 15);
    assert.strictEqual(turn.sortedCharactors[3].name, 'noa');
    assert.strictEqual(turn.sortedCharactors[3].restWt, 0);
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
    assert.strictEqual(gameResult, GameOngoing);
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
    assert.strictEqual(gameResult, GameHome);
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
    assert.strictEqual(gameResult, GameVisitor);
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
    assert.strictEqual(gameResult, GameDraw);
  });
});

