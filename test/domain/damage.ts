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

/*
 * 想定ダメージ調整用テスト
 * - 前衛、後衛
 *   - 後衛へのダメージをHPの27-33%
 *   - 前衛へはその2/3程度を想定
 * - バフ、デバフがかかっている、かかっていない
 *   - 後衛へのダメージを想定し、デバフは1.5倍程度
 *   - 後衛へのダメージを想定し、バフは2/3倍程度
 * - 属性、祝福相性のよい悪い普通の魔法攻撃
 *   - 属性相性がいい場合は2倍程度を想定
 *   - 属性相性が悪い場合は半分程度を想定
 * - 物理耐性特性のあるなしの攻撃
 *   - 物理耐性がある場合は、半分程度を想定
 * - 強い攻撃弱い攻撃
 *   - 強い攻撃は2倍程度を想定
 * 
 * 前衛
 * - ヒューマン
 * - 心の祝福
 * - 鎖帷子
 * - 盾セット
 * 
 * 弓使い
 * - ヒューマン
 * - 心の祝福
 * - 軍人の制服
 * - ロングボウ
 * 
 * 魔法使い
 * - ヒューマン
 * - 心の祝福
 * - 軍人の制服
 * - ロングボウ
 * 
 * 祝福は魔法相性のために変更パターンあり
 * 装備、武器は物理相性のために変更パターンあり
*/


/* テストケース
 * - レイピア(弱め武器)
 *   - 前衛
 *     - 耐性あり
 *     - 耐性なし
 *   - 弓使い
 *   - 魔法使い
 * - 和弓(強め武器)
 *   - 前衛
 *     - 耐性あり
 *     - 耐性なし
 *   - 弓使い
 *   - 魔法使い
 * - 基本魔法
 *   - 前衛
 *   - 弓使い
 *   - 魔法使い
 *     - 属性相性よい
 *     - 属性相性悪い
 *     - 属性相性なし
 * 
 * これだけキャラを用意する
 * - 前衛 レイピア 鋼鉄の鎧
 * - 前衛 レイピア 毛皮の鎧
 * - 弓使い 和弓 軍人の制服 * 2
 * - 魔法使い 火セット * 2
 * - 魔法使い 水セット
 * - 魔法使い 風セット
 */

const testData = {
  title: 'first-title',
  home: {
    name: 'home',
    charactors: [
      { name: 'sam', race: 'human', blessing: 'mind', clothing: 'chainMail', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
      { name: 'sara', race: 'human', blessing: 'mind', clothing: 'soldierUniform', weapon: 'samuraiBow', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: false },
    ],
  },
  visitor: {
    name: 'visitor',
    charactors: [
      { name: 'john', race: 'human', blessing: 'mind', clothing: 'chainMail', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: true },
      { name: 'noa', race: 'human', blessing: 'mind', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: true },
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
        { name: 'sam', race: 'human', blessing: 'mind', clothing: 'chainMail', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120, isVisitor: false },
        { name: 'sara', race: 'human', blessing: 'mind', clothing: 'soldierUniform', weapon: 'samuraiBow', statuses: [], hp: 100, mp: 0, restWt: 115, isVisitor: false },
        { name: 'john', race: 'human', blessing: 'mind', clothing: 'chainMail', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 130, isVisitor: true },
        { name: 'noa', race: 'human', blessing: 'mind', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 110, isVisitor: true },
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

describe('Battle#act', function () {
  it('charactor', function () {
    const battle = (toBattle(testData) as Battle);
    const actor = (toCharactor(testData.home.charactors[0]) as Charactor);
    const receiver = (toCharactor(testData.visitor.charactors[0]) as Charactor);
    const skill = (getSkill('chop') as Skill);

    const turn = actToCharactor(battle, actor, skill, [receiver], new Date(), {
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
    assert.equal(turn.sortedCharactors[3].restWt, 210);
  });
});

