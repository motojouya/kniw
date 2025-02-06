import type { Battle } from "../../src/model/battle";
import type { Skill } from "../../src/model/skill";
import type { CharactorBattling } from "../../src/model/charactor";
import type { BattleJson } from "../../src/store_schema/battle";

import { describe, it, expect } from 'vitest'

import { actToCharactor, GameOngoing } from "../../src/model/battle";
import { toBattle } from "../../src/store_schema/battle";

import { toCharactor } from "../../src/store_schema/charactor";
import { skillRepository } from "../../src/store/skill";

const testData = {
  title: "first-title",
  home: {
    name: "home",
    charactors: [
      {
        name: "sam",
        race: "human",
        blessing: "mind",
        clothing: "steelArmor",
        weapon: "rapier",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 130,
        isVisitor: false,
      },
      {
        name: "sara",
        race: "human",
        blessing: "mind",
        clothing: "soldierUniform",
        weapon: "samuraiBow",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 100,
        isVisitor: false,
      },
      {
        name: "nick",
        race: "human",
        blessing: "mind",
        clothing: "redRobe",
        weapon: "rubyRod",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 120,
        isVisitor: false,
      },
      {
        name: "yoshua",
        race: "human",
        blessing: "mind",
        clothing: "blueRobe",
        weapon: "sapphireRod",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 110,
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
        blessing: "mind",
        clothing: "furArmor",
        weapon: "rapier",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 135,
        isVisitor: true,
      },
      {
        name: "jonny",
        race: "human",
        blessing: "mind",
        clothing: "soldierUniform",
        weapon: "samuraiBow",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 105,
        isVisitor: true,
      },
      {
        name: "noa",
        race: "human",
        blessing: "mind",
        clothing: "redRobe",
        weapon: "rubyRod",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 125,
        isVisitor: true,
      },
      {
        name: "funcy",
        race: "human",
        blessing: "mind",
        clothing: "greenRobe",
        weapon: "emeraldRod",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 115,
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
          name: "sara",
          race: "human",
          blessing: "mind",
          clothing: "soldierUniform",
          weapon: "samuraiBow",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 100,
          isVisitor: false,
        },
        {
          name: "jonny",
          race: "human",
          blessing: "mind",
          clothing: "soldierUniform",
          weapon: "samuraiBow",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 105,
          isVisitor: true,
        },
        {
          name: "yoshua",
          race: "human",
          blessing: "mind",
          clothing: "blueRobe",
          weapon: "sapphireRod",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 110,
          isVisitor: false,
        },
        {
          name: "funcy",
          race: "human",
          blessing: "mind",
          clothing: "greenRobe",
          weapon: "emeraldRod",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 115,
          isVisitor: true,
        },
        {
          name: "nick",
          race: "human",
          blessing: "mind",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 120,
          isVisitor: false,
        },
        {
          name: "noa",
          race: "human",
          blessing: "mind",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 125,
          isVisitor: true,
        },
        {
          name: "sam",
          race: "human",
          blessing: "mind",
          clothing: "steelArmor",
          weapon: "rapier",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 130,
          isVisitor: false,
        },
        {
          name: "john",
          race: "human",
          blessing: "mind",
          clothing: "furArmor",
          weapon: "rapier",
          statuses: [],
          hp: 300,
          mp: 200,
          restWt: 135,
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

describe("Damage#rapier", function () {
  it("前衛刺突耐性なし", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[6]) as CharactorBattling; // sam
    const receiver = toCharactor(testData.turns[0].sortedCharactors[7]) as CharactorBattling; // john
    const skill = skillRepository.get("stab") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[6].name, "john");
    expect(turn.sortedCharactors[6].hp, 230);
    expect(turn.sortedCharactors[6].restWt, 135);

    expect(turn.sortedCharactors[7].name, "sam");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("前衛刺突耐性あり", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[7]) as CharactorBattling; // john
    const receiver = toCharactor(testData.turns[0].sortedCharactors[6]) as CharactorBattling; // sam
    const skill = skillRepository.get("stab") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[6].name, "sam");
    expect(turn.sortedCharactors[6].hp, 280);
    expect(turn.sortedCharactors[6].restWt, 130);

    expect(turn.sortedCharactors[7].name, "john");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("弓使い", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[6]) as CharactorBattling; // sam
    const receiver = toCharactor(testData.turns[0].sortedCharactors[1]) as CharactorBattling; // jonny
    const skill = skillRepository.get("stab") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[1].name, "jonny");
    expect(turn.sortedCharactors[1].hp, 210);
    expect(turn.sortedCharactors[1].restWt, 105);

    expect(turn.sortedCharactors[7].name, "sam");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("魔法使い", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[6]) as CharactorBattling; // sam
    const receiver = toCharactor(testData.turns[0].sortedCharactors[5]) as CharactorBattling; // noa
    const skill = skillRepository.get("stab") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[5].name, "noa");
    expect(turn.sortedCharactors[5].hp, 190);
    expect(turn.sortedCharactors[5].restWt, 125);

    expect(turn.sortedCharactors[7].name, "sam");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
});

describe("Damage#samuraiBow", function () {
  it("前衛刺突耐性なし", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[0]) as CharactorBattling; // sara
    const receiver = toCharactor(testData.turns[0].sortedCharactors[7]) as CharactorBattling; // john
    const skill = skillRepository.get("shot") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[6].name, "john");
    expect(turn.sortedCharactors[6].hp, 230);
    expect(turn.sortedCharactors[6].restWt, 135);

    expect(turn.sortedCharactors[7].name, "sara");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("前衛刺突耐性あり", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[0]) as CharactorBattling; // sara
    const receiver = toCharactor(testData.turns[0].sortedCharactors[6]) as CharactorBattling; // sam
    const skill = skillRepository.get("shot") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[5].name, "sam");
    expect(turn.sortedCharactors[5].hp, 280);
    expect(turn.sortedCharactors[5].restWt, 130);

    expect(turn.sortedCharactors[7].name, "sara");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("弓使い", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[0]) as CharactorBattling; // sara
    const receiver = toCharactor(testData.turns[0].sortedCharactors[1]) as CharactorBattling; // jonny
    const skill = skillRepository.get("shot") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[0].name, "jonny");
    expect(turn.sortedCharactors[0].hp, 210);
    expect(turn.sortedCharactors[0].restWt, 105);

    expect(turn.sortedCharactors[7].name, "sara");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("魔法使い", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[0]) as CharactorBattling; // sara
    const receiver = toCharactor(testData.turns[0].sortedCharactors[5]) as CharactorBattling; // noa
    const skill = skillRepository.get("shot") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[4].name, "noa");
    expect(turn.sortedCharactors[4].hp, 190);
    expect(turn.sortedCharactors[4].restWt, 125);

    expect(turn.sortedCharactors[7].name, "sara");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
});
describe("Damage#flameFall", function () {
  it("前衛", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[4]) as CharactorBattling; // nick
    const receiver = toCharactor(testData.turns[0].sortedCharactors[7]) as CharactorBattling; // john
    const skill = skillRepository.get("flameFall") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[6].name, "john");
    expect(turn.sortedCharactors[6].hp, 230);
    expect(turn.sortedCharactors[6].restWt, 135);

    expect(turn.sortedCharactors[7].name, "nick");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("弓使い", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[4]) as CharactorBattling; // nick
    const receiver = toCharactor(testData.turns[0].sortedCharactors[1]) as CharactorBattling; // jonny
    const skill = skillRepository.get("flameFall") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[1].name, "jonny");
    expect(turn.sortedCharactors[1].hp, 210);
    expect(turn.sortedCharactors[1].restWt, 105);

    expect(turn.sortedCharactors[7].name, "nick");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("属性相性よい", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[4]) as CharactorBattling; // nick
    const receiver = toCharactor(testData.turns[0].sortedCharactors[3]) as CharactorBattling; // funcy
    const skill = skillRepository.get("flameFall") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[3].name, "funcy");
    expect(turn.sortedCharactors[3].hp, 154);
    expect(turn.sortedCharactors[3].restWt, 115);

    expect(turn.sortedCharactors[7].name, "nick");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("属性相性悪い", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[4]) as CharactorBattling; // nick
    const receiver = toCharactor(testData.turns[0].sortedCharactors[2]) as CharactorBattling; // yoshua
    const skill = skillRepository.get("flameFall") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[2].name, "yoshua");
    expect(turn.sortedCharactors[2].hp, 246);
    expect(turn.sortedCharactors[2].restWt, 110);

    expect(turn.sortedCharactors[7].name, "nick");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
  it("属性相性なし", function () {
    const battle = toBattle(testData) as Battle;
    const actor = toCharactor(testData.turns[0].sortedCharactors[4]) as CharactorBattling; // nick
    const receiver = toCharactor(testData.turns[0].sortedCharactors[5]) as CharactorBattling; // noa
    const skill = skillRepository.get("flameFall") as Skill;

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    expect(turn.sortedCharactors[4].name, "noa");
    expect(turn.sortedCharactors[4].hp, 200);
    expect(turn.sortedCharactors[4].restWt, 125);

    expect(turn.sortedCharactors[7].name, "nick");
    expect(turn.sortedCharactors[7].hp, 300);
    expect(turn.sortedCharactors[7].restWt, 230);
  });
});
