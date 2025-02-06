import type { Battle } from "../../src/model/battle";
import type { Party } from "../../src/model/party";
import type { Skill } from "../../src/model/skill";
import type { CharactorBattling } from "../../src/model/charactor";
import type { BattleJson } from "../../src/store_schema/battle";

import { describe, it, expect } from 'vitest'

import {
  actToCharactor,
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
} from "../../src/model/battle";
import { toBattle } from "../../src/store_schema/battle";
import { toParty } from "../../src/store_schema/party";
import { format } from "date-fns";

import { toCharactor } from "../../src/store_schema/charactor";
import { NotWearableErorr } from "../../src/model/acquirement";
import { CharactorDuplicationError } from "../../src/model/party";
import { JsonSchemaUnmatchError, DataNotFoundError } from "../../src/store_utility/schema";
import { skillRepository } from "../../src/store/skill";

const testData = {
  title: "first-title",
  home: {
    name: "home",
    charactors: [
      {
        name: "sam",
        race: "human",
        blessing: "earth",
        clothing: "steelArmor",
        weapon: "swordAndShield",
        statuses: [],
        hp: 100,
        mp: 100,
        restWt: 120,
        isVisitor: false,
      },
      {
        name: "sara",
        race: "human",
        blessing: "earth",
        clothing: "redRobe",
        weapon: "rubyRod",
        statuses: [],
        hp: 100,
        mp: 100,
        restWt: 115,
        isVisitor: false,
      },
    ],
  },
  visitor: {
    name: "visitor",
    charactors: [
      {
        name: "john",
        race: "human",
        blessing: "earth",
        clothing: "steelArmor",
        weapon: "swordAndShield",
        statuses: [],
        hp: 100,
        mp: 100,
        restWt: 130,
        isVisitor: true,
      },
      {
        name: "noa",
        race: "human",
        blessing: "earth",
        clothing: "redRobe",
        weapon: "rubyRod",
        statuses: [],
        hp: 100,
        mp: 100,
        restWt: 110,
        isVisitor: true,
      },
    ],
  },
  turns: [
    {
      datetime: "2023-06-29T12:12:21",
      action: {
        type: "TIME_PASSING",
        wt: 0,
      },
      sortedCharactors: [
        {
          name: "sam",
          race: "human",
          blessing: "earth",
          clothing: "steelArmor",
          weapon: "swordAndShield",
          statuses: [],
          hp: 100,
          mp: 100,
          restWt: 120,
          isVisitor: false,
        },
        {
          name: "sara",
          race: "human",
          blessing: "earth",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 100,
          mp: 100,
          restWt: 115,
          isVisitor: false,
        },
        {
          name: "john",
          race: "human",
          blessing: "earth",
          clothing: "steelArmor",
          weapon: "swordAndShield",
          statuses: [],
          hp: 100,
          mp: 100,
          restWt: 130,
          isVisitor: true,
        },
        {
          name: "noa",
          race: "human",
          blessing: "earth",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 100,
          mp: 100,
          restWt: 110,
          isVisitor: true,
        },
      ],
      field: {
        climate: "SUNNY",
      },
    },
  ],
  result: GameOngoing,
} as BattleJson;

type FormatDate = (date: Date) => string;
const formatDate: FormatDate = (date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

describe("Battle#toBattle", function () {
  it("ok", function () {
    const battle = toBattle(testData);

    if (
      battle instanceof NotWearableErorr ||
      battle instanceof DataNotFoundError ||
      battle instanceof CharactorDuplicationError ||
      battle instanceof JsonSchemaUnmatchError ||
      battle instanceof NotBattlingError
    ) {
      expect(true, false);
    } else {
      expect(battle.title, "first-title");
      expect(battle.home.name, "home");
      expect(battle.visitor.name, "visitor");
      expect(battle.turns.length, 1);
      expect(formatDate(battle.turns[0].datetime), "2023-06-29T12:12:21");
      expect(battle.result, GameOngoing);
    }
  });
});

describe("Battle#start", function () {
  it("ok", function () {
    const homeParty = toParty({
      name: "home",
      charactors: [
        {
          name: "sam",
          race: "human",
          blessing: "earth",
          clothing: "steelArmor",
          weapon: "swordAndShield",
          statuses: [],
          hp: 100,
          mp: 0,
          restWt: 120,
        },
        {
          name: "john",
          race: "human",
          blessing: "earth",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 100,
          mp: 0,
          restWt: 115,
        },
      ],
    }) as Party;
    const visitorParty = toParty({
      name: "visitor",
      charactors: [
        {
          name: "tom",
          race: "lizardman",
          blessing: "earth",
          clothing: "steelArmor",
          weapon: "swordAndShield",
          statuses: [],
          hp: 100,
          mp: 0,
          restWt: 130,
        },
        {
          name: "chang",
          race: "werewolf",
          blessing: "earth",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 100,
          mp: 0,
          restWt: 110,
        },
      ],
    }) as Party;

    const battle = createBattle("first-title", homeParty, visitorParty);
    expect(battle.result, GameOngoing);

    const turn = start(battle, new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    expect(turn.action.type, "TIME_PASSING");
    if (turn.action.type === "TIME_PASSING") {
      expect(turn.action.wt, 0);
    } else {
      expect(true, false);
    }

    expect(turn.field.climate, "SUNNY");
    expect(turn.sortedCharactors.length, 4);
    expect(turn.sortedCharactors[0].name, "chang");
    expect(turn.sortedCharactors[0].isVisitor, true);
    expect(turn.sortedCharactors[1].name, "john");
    expect(turn.sortedCharactors[1].isVisitor, false);
    expect(turn.sortedCharactors[2].name, "sam");
    expect(turn.sortedCharactors[2].isVisitor, false);
    expect(turn.sortedCharactors[3].name, "tom");
    expect(turn.sortedCharactors[3].isVisitor, true);
  });
});

describe("Battle#act", function () {
  it("charactor", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.home.charactors[0]) as CharactorBattling;
    const receiver = toCharactor(testData.visitor.charactors[0]) as CharactorBattling;
    const skill = skillRepository.get("chop") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    expect(turn.action.type, "DO_SKILL");
    if (turn.action.type === "DO_SKILL") {
      expect(turn.action.actor.name, "sam");
      expect(turn.action.skill.name, "chop");
      expect(turn.action.receivers.length, 1);
      expect(turn.action.receivers[0].name, "john");
    } else {
      expect(true, false);
    }

    expect(turn.field.climate, "SUNNY");
    expect(turn.sortedCharactors.length, 4);
    expect(turn.sortedCharactors[0].name, "noa");
    expect(turn.sortedCharactors[1].name, "sara");

    expect(turn.sortedCharactors[2].name, "john");
    expect(turn.sortedCharactors[2].hp, 54);
    expect(turn.sortedCharactors[2].restWt, 130);

    expect(turn.sortedCharactors[3].name, "sam");
    expect(turn.sortedCharactors[3].hp, 100);
    expect(turn.sortedCharactors[3].restWt, 240);
  });
});

describe("Battle#stay", function () {
  it("ok", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.home.charactors[0]) as CharactorBattling;

    const turn = stay(battle, actor, new Date());

    expect(turn.action.type, "DO_NOTHING");
    if (turn.action.type === "DO_NOTHING") {
      expect(turn.action.actor.name, "sam");
    } else {
      expect(true, false);
    }

    expect(turn.field.climate, "SUNNY");
    expect(turn.sortedCharactors.length, 4);
    expect(turn.sortedCharactors[0].name, "noa");
    expect(turn.sortedCharactors[1].name, "sara");
    expect(turn.sortedCharactors[2].name, "john");
    expect(turn.sortedCharactors[3].name, "sam");
  });
});

describe("Battle#wait", function () {
  it("ok", function () {
    const battle = toBattle(testData) as Battle;

    const turn = wait(battle, 115, new Date(), {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    expect(turn.action.type, "TIME_PASSING");
    if (turn.action.type === "TIME_PASSING") {
      expect(turn.action.wt, 115);
    } else {
      expect(true, false);
    }

    expect(turn.field.climate, "SUNNY");
    expect(turn.sortedCharactors.length, 4);
    expect(turn.sortedCharactors[0].name, "sam");
    expect(turn.sortedCharactors[0].restWt, 5);
    expect(turn.sortedCharactors[1].name, "sara");
    expect(turn.sortedCharactors[1].restWt, 0);
    expect(turn.sortedCharactors[2].name, "john");
    expect(turn.sortedCharactors[2].restWt, 15);
    expect(turn.sortedCharactors[3].name, "noa");
    expect(turn.sortedCharactors[3].restWt, 0);
  });
});

// export type IsSettlement = (battle: Battle) => GameResult;
// export const isSettlement: IsSettlement = battle => {
// return GameDraw;
// return GameHome;
// return GameVisitor;
// return GameOngoing;
describe("Battle#isSettlement", function () {
  it("GameOngoing", function () {
    const battle = toBattle(testData) as Battle;
    const gameResult = isSettlement(battle);
    expect(gameResult, GameOngoing);
  });
  it("GameHome", function () {
    const data = {
      ...testData,
      turns: [
        {
          ...testData.turns[0],
          sortedCharactors: [
            { ...testData.turns[0].sortedCharactors[0] },
            { ...testData.turns[0].sortedCharactors[1], hp: 0 },
            { ...testData.turns[0].sortedCharactors[2], hp: 0 },
            { ...testData.turns[0].sortedCharactors[3], hp: 0 },
          ],
        },
      ],
    };

    const battle = toBattle(data) as Battle;
    const gameResult = isSettlement(battle);
    expect(gameResult, GameHome);
  });
  it("GameVisitor", function () {
    const data = {
      ...testData,
      turns: [
        {
          ...testData.turns[0],
          sortedCharactors: [
            { ...testData.turns[0].sortedCharactors[0], hp: 0 },
            { ...testData.turns[0].sortedCharactors[1], hp: 0 },
            { ...testData.turns[0].sortedCharactors[2] },
            { ...testData.turns[0].sortedCharactors[3], hp: 0 },
          ],
        },
      ],
    };

    const battle = toBattle(data) as Battle;
    const gameResult = isSettlement(battle);
    expect(gameResult, GameVisitor);
  });
  it("GameDraw", function () {
    const data = {
      ...testData,
      turns: [
        {
          ...testData.turns[0],
          sortedCharactors: [
            { ...testData.turns[0].sortedCharactors[0], hp: 0 },
            { ...testData.turns[0].sortedCharactors[1], hp: 0 },
            { ...testData.turns[0].sortedCharactors[2], hp: 0 },
            { ...testData.turns[0].sortedCharactors[3], hp: 0 },
          ],
        },
      ],
    };

    const battle = toBattle(data) as Battle;
    const gameResult = isSettlement(battle);
    expect(gameResult, GameDraw);
  });
});
