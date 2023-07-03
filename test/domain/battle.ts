import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';

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

// export type CreateBattle = (battleJson: any) => Battle | NotWearableErorr | AcquirementNotFoundError | CharactorDuplicationError | SkillNotFoundError | JsonSchemaUnmatchError;
// export const createBattle: CreateBattle = battleJson => {
// export type NewBattle = (datetime: Date, home: Party, visitor: Party) => Battle;
// export const newBattle: NewBattle = (datetime, home, visitor) => ({
// export type Act = (battle: Battle, actor: Charactor, skill: Skill, receivers: Charactor[], datetime: Date, randoms: Randoms) => Turn
// export const act: Act = (battle, actor, skill, receivers, datetime, randoms) => {
// export type Stay = (battle: Battle, actor: Charactor, datetime: Date, randoms: Randoms) => Turn
// export const stay: Stay = (battle, actor, datetime, randoms) => {
// export type Wait = (battle: Battle, wt: number, datetime: Date, randoms: Randoms) => Turn
// export const wait: Wait = (battle, wt, datetime, randoms) => {
// export type Start = (battle: Battle, datetime: Date, randoms: Randoms) => Turn;
// export const start: Start = (battle, datetime, randoms) => ({
// export type IsSettlement = (battle: Battle) => GameResult;
// export const isSettlement: IsSettlement = battle => {

export const testData = {
  datetime: '2023-06-29T12:12:12',
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
      datetime: '2023-06-29T12:12:21',
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

describe('Battle#createBattle', function () {
  it('ok', function () {
    const battle = createBattle(testData);

    if (battle instanceof NotWearableErorr
     || battle instanceof AcquirementNotFoundError
     || battle instanceof CharactorDuplicationError
     || battle instanceof SkillNotFoundError
     || battle instanceof JsonSchemaUnmatchError
    ) {
      assert.equal(true, false);
    }
    assert.equal(battle.);
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
  // it('NotWearableErorr', function () {
  //   const charactor = createCharactor('sam', 'fairy', 'earth', 'steelArmor', 'lightSword');
  //   assert.equal(charactor instanceof NotWearableErorr, true);
  //   if (charactor instanceof NotWearableErorr) {
  //     assert.equal(charactor.acquirement.name, 'earth');
  //     assert.equal(charactor.cause.name, 'fairy');
  //     assert.equal(charactor.message, 'このキャラクターの設定ではearthを装備できません');
  //   } else {
  //     assert.equal(true, false);
  //   }
  // });
  // it('ok', function () {
  //   const charactor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
  //   assert.equal(charactor.name, 'sam');
  //   assert.equal(charactor.race.name, 'human');
  //   assert.equal(charactor.blessing.name, 'earth');
  //   assert.equal(charactor.clothing.name, 'fireRobe');
  //   assert.equal(charactor.weapon.name, 'fireWand');

  //   const abilities = getAbilities(charactor);
  //   assert.equal(abilities.length, 1);
  //   assert.equal(abilities[0].name, 'mpGainPlus');

  //   const skills = getSkills(charactor);
  //   assert.equal(skills.length, 1);
  //   assert.equal(skills[0].name, 'volcanoRise');

  //   const physical = getPhysical(charactor);
  //   assert.equal(physical.MaxHP, 100);
  //   assert.equal(physical.MaxMP, 100);
  //   assert.equal(physical.STR, 120);
  //   assert.equal(physical.VIT, 120);
  //   assert.equal(physical.DEX, 100);
  //   assert.equal(physical.AGI, 100);
  //   assert.equal(physical.AVD, 100);
  //   assert.equal(physical.INT, 110);
  //   assert.equal(physical.MND, 120);
  //   assert.equal(physical.RES, 100);
  //   assert.equal(physical.WT, 110);
  // });
});

