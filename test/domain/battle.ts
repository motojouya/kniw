import assert from 'assert';
import {
  createBattle,
  act,
  stay,
  wait,
  start,
  isSettlement,
  createStore,
  isActionTimePassing,
} from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import { createParty } from 'src/domain/party';

// export type CreateBattle = (home: Party, visitor: Party, turns: Turn[], result: GameResult | null) => Battle;
// export const createBattle = (datetime, home, visitor, turns, result) => ({
// export type Act = (battle: Battle, actor: Charactor, skill: Skill, receivers: Charactor[], datetime: Date, randoms: Randoms) => Turn
// export const act: Act = (battle, actor, skill, receivers, datetime, randoms) => {
// export type Stay = (battle: Battle, actor: Charactor, datetime: Date, randoms: Randoms) => Turn
// export const stay: Stay = (battle, actor, datetime, randoms) => {
// export type Wait = (battle: Battle, wt: number, datetime: Date, randoms: Randoms) => Turn
// export const wait: Wait = (battle, wt, datetime, randoms) => {
// export type Start = (homeParty: Party, visitorParty: Party, datetime: Date, randoms: Randoms) => Turn;
// export const start: Start = (homeParty, visitorParty, datetime, randoms) => ({
// export type IsSettlement = (battle: Battle) => GameResult | null;
// export const isSettlement: IsSettlement = battle => {
// export const createStore: CreateStore<Battle> = repository => {

describe('Battle#start', function () {
  it('ok', function () {

    const homeParty = (createParty('home', [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]) as Party);
    const visitorParty = (createParty('visitor', [
      { name: 'tom', race: 'lizardman', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'chang', race: 'werewolf', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]) as Party);

    const now = new Date();

    const turn = start(homeParty, visitorParty, now, {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });

    assert.equal(isActionTimePassing(turn.action), true);
    if (isActionTimePassing(turn.action)) {
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
  //   assert.equal(isNotWearableErorr(charactor), true);
  //   if (isNotWearableErorr(charactor)) {
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

// const storeMock: Repository = {
//   save: (namespace, objctKey, obj) => new Promise((resolve, reject) => resolve()),
//   get: (namespace, objctKey) => new Promise((resolve, reject) => resolve({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand' })),
//   remove: (namespace, objctKey) => new Promise((resolve, reject) => resolve()),
//   list: namespace => new Promise((resolve, reject) => resolve(['sam', 'john'])),
//   checkNamespace: namespace => new Promise((resolve, reject) => resolve()),
// };
// 
// describe('Charctor#createStore', function () {
//   it('save', async () => {
//     const store = createStore(storeMock);
//     const charactor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
//     await store.save(charactor);
//     assert.equal(true, true);
//   });
//   it('get', async () => {
//     const store = createStore(storeMock);
//     const charactor = await store.get('sam');
//     if (charactor) {
//       assert.equal(charactor.name, 'sam');
//       assert.equal(charactor.race.name, 'human');
//       assert.equal(charactor.blessing.name, 'earth');
//       assert.equal(charactor.clothing.name, 'fireRobe');
//       assert.equal(charactor.weapon.name, 'fireWand');
//     } else {
//       assert.equal(true, false);
//     }
//   });
//   it('remove', async () => {
//     const store = createStore(storeMock);
//     await store.remove('sam');
//     assert.equal(true, true);
//   });
//   it('list', async () => {
//     const store = createStore(storeMock);
//     const charactorList = await store.list();
//     assert.equal(charactorList.length, 2);
//     assert.equal(charactorList[0], 'sam');
//     assert.equal(charactorList[1], 'john');
//   });
// });

