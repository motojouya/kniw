import type { Field } from 'src/domain/field';
import type { Party } from 'src/domain/party'
import { Charactor, createCharactor } from 'src/domain/charactor'
import type { Skill } from 'src/domain/skill'
import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
} from 'src/domain/store';
import type { Randoms } from 'src/domain/random';

import { changeClimate } from 'src/domain/field';
import { getPhysical, getAbilities, createCharactorJson } from 'src/domain/charactor'
import { createPartyJson } from 'src/domain/party';

const NAMESPACE = 'battle';

export type GameResult = 'ONGOING' | 'HOME' | 'VISITOR' | 'DRAW';
export const GameOngoing: GameResult = 'ONGOING';
export const GameHome: GameResult = 'HOME';
export const GameVisitor: GameResult = 'VISITOR';
export const GameDraw: GameResult = 'DRAW';

export type DoSkill = {
  actor: Charactor,
  skill: Skill,
  receivers: Charactor[],
};

export function isActionDoSkill(obj: any): obj is DoSkill {
  return !!obj && typeof obj === 'object' && 'actor' in obj && 'skill' in obj && 'receivers' in obj && !('wt' in obj);
}

export type DoNothing = {
  actor: Charactor,
};

export function isActionDoNothing(obj: any): obj is DoNothing {
  return !!obj && typeof obj === 'object' && 'actor' in obj && !('skill' in obj) && !('receivers' in obj) && !('wt' in obj);
}

export type TimePassing = {
  wt: number,
};

export function isActionTimePassing(obj: any): obj is TimePassing {
  return !!obj && typeof obj === 'object' && !('actor' in obj) && !('skill' in obj) && !('receivers' in obj) && 'wt' in obj;
}

export type Action = TimePassing | DoNothing | DoSkill;

export type Turn = {
  datetime: Date,
  action: Action,
  sortedCharactors: Charactor[]
  field: Field,
};

export type Battle = {
  datetime: Date,
  home: Party,
  visitor: Party,
  turns: Turn[],
  result: GameResult,
}

//TODO 続きここから
export type CreateTurn = () => Turn;

export type CreateBattle = (datetime: Date, home: Party, visitor: Party, turns: Turn[], result: GameResult) => Battle;
export const createBattle: CreateBattle = (datetime, home, visitor, turns, result) => ({
  datetime,
  home,
  visitor,
  turns,
  result,
});

export type DoSkillJson = {
  actor: CharactorJson,
  skill: name,
  receivers: CharactorJson[],
};

export type DoNothingJson = {
  actor: CharactorJson,
};

export type TimePassingJson = {
  wt: number,
};

export type ActionJson = DoSkillJson | DoNothingJson | TimePassingJson

type CreateActionJson = (action: Action) => ActionJson;
const createActionJson: CreateActionJson = action => {
  if (isActionDoSkill(action)) {
    return {
      actor: createCharactorJson(action.actor),
      skill: action.skill.name,
      receivers: action.receivers.map(createCharactorJson),
    };
  }
  if (isActionDoNothing(action)) {
    return {
      actor: createCharactorJson(action.actor),
    };
  }
  if (isActionTimePassing(action)) {
    return {
      wt: action.wt,
    };
  }
}

export type TurnJson = {
  datetime: string,
  action: ActionJson,
  sortedCharactors: CharactorJson[]
  field: {
    climate: string,
  },
};

type CreateTurnJson = (turn: Turn) => BattleJson;
const createTurnJson: CreateTurnJson = turn => ({
  datetime: turn.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  action: createActionJson(turn.action),
  sortedCharactors: turn.sortedCharactors.map(createCharactorJson),
  field: turn.field,
});

export type BattleJson = {
  datetime: string,
  home: PartyJson,
  visitor: PartyJson,
  turns: TurnJson[],
  result: string,
};

type CreateBattleJson = (battle: Battle) => BattleJson;
const createBattleJson: CreateBattleJson = battle => ({
  datetime: battle.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  home: createPartyJson(battle.home),
  visitor: createPartyJson(battle.visitor),
  turns: battle.turns.map(createTurnJson);
  result: battle.result,
});


type UpdateCharactor = (receivers: Charactor[]) => (charactor: Charactor) => Charactor;
const updateCharactor: UpdateCharactor = receivers => charactor => {
  const receiver = receivers.find(receiver => charactor.name === receiver.name);
  if (receiver) {
    return receiver;
  }
  return charactor;
}

////TODO util?
//type ArrayLast<T> = (ary: Array<T>) => T;
//const arrayLast: ArrayLast<T> = <T> ary => ary.slice(-1)[0];

//TODO util?
function arrayLast<T>(ary: Array<T>): T {
  return ary.slice(-1)[0];
}

export type Act = (battle: Battle, actor: Charactor, skill: Skill, receivers: Charactor[], datetime: Date, randoms: Randoms) => Turn
export const act: Act = (battle, actor, skill, receivers, datetime, randoms) => {
  const lastTurn = arrayLast(battle.turns);
  const newTurn = {
    datetime,
    action: {
      actor,
      skill,
      receivers,
    },
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };

  if (skill.receiverCount === 0) {
    newTurn.field = skill.action(skill, actor, randoms, lastTurn.field);
  } else {
    const resultReceivers = receivers.map(receiver => skill.action(skill, actor, randoms, lastTurn.field, receiver));
    newTurn.sortedCharactors = newTurn.sortedCharactors.map(updateCharactor(resultReceivers));
  }

  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => {
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      actor.restWt = getPhysical(actor).WT + skill.additionalWt;
    }
    return actor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

export type Stay = (battle: Battle, actor: Charactor, datetime: Date, randoms: Randoms) => Turn
export const stay: Stay = (battle, actor, datetime, randoms) => {
  const lastTurn = arrayLast(battle.turns);
  const newTurn = {
    datetime,
    action: { actor },
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };

  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => {
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      actor.restWt = getPhysical(actor).WT;
    }
    return actor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

type WaitCharactor = (charactor: Charactor, wt: number, randoms: Randoms) => Charactor;
const waitCharactor: WaitCharactor = (charactor, wt, randoms) => {

  const abilities = getAbilities(charactor);
  const newCharactor = abilities.reduce((charactor, ability) => ability.wait(wt, charactor, randoms), { ...charactor });

  newCharactor.statuses = newCharactor.statuses
    .map(status => {
      status.restWt -= wt;
      return status;
    })
    .filter(status => status.restWt > 0);

  newCharactor.restWt = Math.max((newCharactor.restWt - wt), 0);
  return newCharactor;
};

//ターン経過による状態変化を起こす関数
//これの実装はabilityかあるいはstatusに持たせたほうがいいか。体力の回復とかステータス異常の回復とかなので
export type Wait = (battle: Battle, wt: number, datetime: Date, randoms: Randoms) => Turn
export const wait: Wait = (battle, wt, datetime, randoms) => {
  const lastTurn = arrayLast(battle.turns);
  const newTurn = {
    datetime,
    action: { wt },
    sortedCharactors: lastTurn.sortedCharactors,
    field: {
      climate: changeClimate(randoms)
    },
  };
  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => waitCharactor(charactor, wt, randoms));

  return newTurn;
};

type SortByWT = (charactors: Charactor[]) => Charactor[]
const sortByWT: SortByWT = charactors => charactors.sort((left, right) => {
  //TODO restWtが一致しているケースにどういう判断でsort順を決めるか。
  //最終的にランダム、あるいはホーム側が有利になってもいいが、パラメータとか見てなるべく一貫性のあるものにしたい
  return left.restWt - right.restWt;
});

export type Start = (homeParty: Party, visitorParty: Party, datetime: Date, randoms: Randoms) => Turn;
export const start: Start = (homeParty, visitorParty, datetime, randoms) => ({
  datetime,
  action: { wt: 0 },
  sortedCharactors: sortByWT([...homeParty.charactors, ...visitorParty.charactors]),
  field: {
    climate: changeClimate(randoms)
  },
});

export type IsSettlement = (battle: Battle) => GameResult;
export const isSettlement: IsSettlement = battle => {
  const lastestTurn = arrayLast(battle.turns);
  const homeCharactors = lastestTurn.sortedCharactors.filter(charactor => !charactor.isVisitor && charactor.hp);
  const visitorCharactors = lastestTurn.sortedCharactors.filter(charactor => charactor.isVisitor && charactor.hp);

  if (homeCharactors.length === 0 && visitorCharactors.length === 0) {
    return GameDraw;
  }
  if (homeCharactors.length > 0 && visitorCharactors.length === 0) {
    return GameHome;
  }
  if (homeCharactors.length === 0 && visitorCharactors.length > 0) {
    return GameVisitor;
  }
  return GameOngoing;
};

//TODO Date型がUTCで時間を保持するので、save時にJSTに変換する必要がある。get時のutcへの戻しも
const createSave: CreateSave<Battle> =
  storage =>
  async obj =>
  (await storage.save(NAMESPACE, obj.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), createBattleJson(obj)));

const createGet: CreateGet<Battle> = storage => async name => {
  const result = await storage.get(NAMESPACE, name);
  return createBattle(...result);
}

const createRemove: CreateRemove =
  storage =>
  async name =>
  (await storage.remove(NAMESPACE, name));

const createList: CreateList =
  storage =>
  async () =>
  (await storage.list(NAMESPACE));

export const createStore: CreateStore<Battle> = repository => {
  repository.checkNamespace(NAMESPACE);
  return {
    save: createSave(repository),
    list: createList(repository),
    get: createGet(repository),
    remove: createRemove(repository),
  }
};

