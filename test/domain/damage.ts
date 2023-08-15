import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import type { Skill } from 'src/domain/skill';

import assert from 'assert';
import {
  toBattle,
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

/* TODO
 * - 属性相性と、物理耐性のダメージ実装 done
 *  - 強攻撃の実装 done
 * - ダメージ調整 done
 * - ダメージ以外のステータス、特にWT調整 done
 * - 命中率の実装
 * - 他acquirementの実装
 * - mp消費とmp回復の実装
 * - バフ、デバフのダメージ効果実装 -> それぞれ1.2倍とか0.8倍とかでいいと思う
 * - その他TODO潰し
 */

const testData = {
  title: 'first-title',
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'mind', clothing: 'steelArmor', weapon: 'rapier', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: false },
      { name: 'sara', race: 'human', blessing: 'mind', clothing: 'soldierUniform', weapon: 'samuraiBow', statuses: [], hp: 100, mp: 0, restWt: 100, isVisitor: false },
      { name: 'nick', race: 'human', blessing: 'mind', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
      { name: 'yoshua', race: 'human', blessing: 'mind', clothing: 'blueRobe', weapon: 'sapphireRod', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: false },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'mind', clothing: 'furArmor', weapon: 'rapier', statuses: [], hp: 100, mp: 0, restWt: 135, isVisitor: true },
      { name: 'jonny', race: 'human', blessing: 'mind', clothing: 'soldierUniform', weapon: 'samuraiBow', statuses: [], hp: 100, mp: 0, restWt: 105, isVisitor: true },
      { name: 'noa', race: 'human', blessing: 'mind', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 125, isVisitor: true },
      { name: 'funcy', race: 'human', blessing: 'mind', clothing: 'greenRobe', weapon: 'emeraldRod', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: true },
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
        { name: 'sara',   race: 'human', blessing: 'mind', clothing: 'soldierUniform', weapon: 'samuraiBow',  statuses: [], hp: 300, mp: 0, restWt: 100, isVisitor: false },
        { name: 'jonny',  race: 'human', blessing: 'mind', clothing: 'soldierUniform', weapon: 'samuraiBow',  statuses: [], hp: 300, mp: 0, restWt: 105, isVisitor: true  },
        { name: 'yoshua', race: 'human', blessing: 'mind', clothing: 'blueRobe',       weapon: 'sapphireRod', statuses: [], hp: 300, mp: 0, restWt: 110, isVisitor: false },
        { name: 'funcy',  race: 'human', blessing: 'mind', clothing: 'greenRobe',      weapon: 'emeraldRod',  statuses: [], hp: 300, mp: 0, restWt: 115, isVisitor: true  },
        { name: 'nick',   race: 'human', blessing: 'mind', clothing: 'redRobe',        weapon: 'rubyRod',     statuses: [], hp: 300, mp: 0, restWt: 120, isVisitor: false },
        { name: 'noa',    race: 'human', blessing: 'mind', clothing: 'redRobe',        weapon: 'rubyRod',     statuses: [], hp: 300, mp: 0, restWt: 125, isVisitor: true  },
        { name: 'sam',    race: 'human', blessing: 'mind', clothing: 'steelArmor',     weapon: 'rapier',      statuses: [], hp: 300, mp: 0, restWt: 130, isVisitor: false },
        { name: 'john',   race: 'human', blessing: 'mind', clothing: 'furArmor',       weapon: 'rapier',      statuses: [], hp: 300, mp: 0, restWt: 135, isVisitor: true  },
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

describe('Damage#rapier', function () {
  it('前衛刺突耐性なし', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[6]) as Charactor); // sam
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[7]) as Charactor); // john
    const skill = (getSkill('stab') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[6].name, 'john');
    assert.equal(turn.sortedCharactors[6].hp, 230);
    assert.equal(turn.sortedCharactors[6].restWt, 135);

    assert.equal(turn.sortedCharactors[7].name, 'sam');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 220);
  });
  it('前衛刺突耐性あり', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[7]) as Charactor); // john
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[6]) as Charactor); // sam
    const skill = (getSkill('stab') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[6].name, 'sam');
    assert.equal(turn.sortedCharactors[6].hp, 280);
    assert.equal(turn.sortedCharactors[6].restWt, 130);

    assert.equal(turn.sortedCharactors[7].name, 'john');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 220);
  });
  it('弓使い', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[6]) as Charactor); // sam
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[1]) as Charactor); // jonny
    const skill = (getSkill('stab') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[1].name, 'jonny');
    assert.equal(turn.sortedCharactors[1].hp, 210);
    assert.equal(turn.sortedCharactors[1].restWt, 105);

    assert.equal(turn.sortedCharactors[7].name, 'sam');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 220);
  });
  it('魔法使い', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[6]) as Charactor); // sam
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[5]) as Charactor); // noa
    const skill = (getSkill('stab') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[5].name, 'noa');
    assert.equal(turn.sortedCharactors[5].hp, 190);
    assert.equal(turn.sortedCharactors[5].restWt, 125);

    assert.equal(turn.sortedCharactors[7].name, 'sam');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 220);
  });
});

describe('Damage#samuraiBow', function () {
  it('前衛刺突耐性なし', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[0]) as Charactor); // sara
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[7]) as Charactor); // john
    const skill = (getSkill('shot') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[6].name, 'john');
    assert.equal(turn.sortedCharactors[6].hp, 230);
    assert.equal(turn.sortedCharactors[6].restWt, 135);

    assert.equal(turn.sortedCharactors[7].name, 'sara');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('前衛刺突耐性あり', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[0]) as Charactor); // sara
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[6]) as Charactor); // sam
    const skill = (getSkill('shot') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[5].name, 'sam');
    assert.equal(turn.sortedCharactors[5].hp, 280);
    assert.equal(turn.sortedCharactors[5].restWt, 130);

    assert.equal(turn.sortedCharactors[7].name, 'sara');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('弓使い', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[0]) as Charactor); // sara
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[1]) as Charactor); // jonny
    const skill = (getSkill('shot') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[0].name, 'jonny');
    assert.equal(turn.sortedCharactors[0].hp, 210);
    assert.equal(turn.sortedCharactors[0].restWt, 105);

    assert.equal(turn.sortedCharactors[7].name, 'sara');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('魔法使い', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[0]) as Charactor); // sara
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[5]) as Charactor); // noa
    const skill = (getSkill('shot') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[4].name, 'noa');
    assert.equal(turn.sortedCharactors[4].hp, 190);
    assert.equal(turn.sortedCharactors[4].restWt, 125);

    assert.equal(turn.sortedCharactors[7].name, 'sara');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
});
describe('Damage#flameFall', function () {
  it('前衛', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[4]) as Charactor); // nick
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[7]) as Charactor); // john
    const skill = (getSkill('flameFall') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[6].name, 'john');
    assert.equal(turn.sortedCharactors[6].hp, 230);
    assert.equal(turn.sortedCharactors[6].restWt, 135);

    assert.equal(turn.sortedCharactors[7].name, 'nick');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('弓使い', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[4]) as Charactor); // nick
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[1]) as Charactor); // jonny
    const skill = (getSkill('flameFall') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[1].name, 'jonny');
    assert.equal(turn.sortedCharactors[1].hp, 210);
    assert.equal(turn.sortedCharactors[1].restWt, 105);

    assert.equal(turn.sortedCharactors[7].name, 'nick');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('属性相性よい', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[4]) as Charactor); // nick
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[3]) as Charactor); // funcy
    const skill = (getSkill('flameFall') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[3].name, 'funcy');
    assert.equal(turn.sortedCharactors[3].hp, 154);
    assert.equal(turn.sortedCharactors[3].restWt, 115);

    assert.equal(turn.sortedCharactors[7].name, 'nick');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('属性相性悪い', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[4]) as Charactor); // nick
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[2]) as Charactor); // yoshua
    const skill = (getSkill('flameFall') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[2].name, 'yoshua');
    assert.equal(turn.sortedCharactors[2].hp, 246);
    assert.equal(turn.sortedCharactors[2].restWt, 110);

    assert.equal(turn.sortedCharactors[7].name, 'nick');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
  it('属性相性なし', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.turns[0].sortedCharactors[4]) as Charactor); // nick
    const receiver = (toCharactor(testData.turns[0].sortedCharactors[5]) as Charactor); // noa
    const skill = (getSkill('flameFall') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
      times: 0.5,
      damage: 0.5,
      accuracy: 0.5,
    });

    assert.equal(turn.sortedCharactors[4].name, 'noa');
    assert.equal(turn.sortedCharactors[4].hp, 200);
    assert.equal(turn.sortedCharactors[4].restWt, 125);

    assert.equal(turn.sortedCharactors[7].name, 'nick');
    assert.equal(turn.sortedCharactors[7].hp, 300);
    assert.equal(turn.sortedCharactors[7].restWt, 215);
  });
});
