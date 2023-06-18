import type { Field } from 'src/domain/field';
import { changeClimate } from 'src/domain/field';
import { Party } from 'src/domain/party'
import { Charactor } from 'src/domain/charactor'
import { Skill } from 'src/domain/skill'
import {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
} from 'src/domain/store';

const NAMESPACE = 'battle';

export type GameResult = 'HOME' | 'VISITOR' | 'DRAW';

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
  result?: GameResult,
}

export type CreateBattle = (home: Party, visitor: Party, turns: Turn[], result: GameResult | null) => Battle;
export const createBattle: CreateBattle = (datetime, home, visitor, turns, result) => ({
  datetime,
  home,
  visitor,
  turns,
  result,
});

type UpdateCharactor = (receivers: Charactor[]) => (charactor: Charactor) => Charactor;
const updateCharactor: UpdateCharactor = receivers => charactor => {
  const receiver = resultReceivers.find(receiver => charactor.name === receiver.name);
  if (receiver) {
    return receiver;
  }
  return charactor;
}

//TODO util?
type ArrayLast<T> = (ary: Array) => T;
type arrayLast: ArrayLast<T> = ary => ary.slice(-1)[0];

export type Act = (battle: Battle, actor: Charactor, skill: Skill, receivers: Charactor[], datetime: Date, randoms: Randoms) => Turn
export const act: Act = (battle, actor, skill, receivers, datetime, randoms) => {
  const lastTurn = arrayLast(battle.turns);
  const newTurn = {
    datetime,
    actor,
    skill,
    receivers,
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };

  if (skill.receiverCount === 0) {
    newTurn.field = skill.action(skill)(actor)(randoms)(turn.field);
  } else {
    const resultReceivers = receivers.map(receiver => skill.action(skill)(actor)(randoms)(turn.field)(receiver));
    newTurn.sortedCharactors = newTurn.sortedCharactors.map(updateCharactor(resultReceivers));
  }

  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => {
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      actor.restWt = getPhysical(actor).wt + skill.additionalWt;
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
    actor,
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };

  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => {
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      actor.restWt = getPhysical(actor).wt;
    }
    return actor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

type WaitCharactor = (charactor: Charactor, wt: number, randoms: Randoms) => Charactor;
const waitCharactor: WaitTurns = (charactor, wt, randoms) => {

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
    wt,
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
  wt: 0,
  sortedCharactors: sortByWT([...homeParty.charactors, ...visitorParty.charactors]),
  field: {
    climate: changeClimate(randoms)
  },
});

export type IsSettlement = (battle: Battle) => GameResult | null;
export const isSettlement: IsSettlement = battle => {
  const lastestTurn = arrayLast(battle.turns);
  const homeCharactors = sortedCharactors.filter(charactor => !charactor.isVisitor && charactor.hp);
  const visitorCharactors = sortedCharactors.filter(charactor => charactor.isVisitor && charactor.hp);

  if (homeCharactors.length === 0 && visitorCharactors.length === 0) {
    return 'DRAW';
  }
  if (homeCharactors.length > 0 && visitorCharactors.length === 0) {
    return 'HOME';
  }
  if (homeCharactors.length === 0 && visitorCharactors.length > 0) {
    return 'VISITOR';
  }
  return null;
};

//TODO Date型がUTCで時間を保持するので、save時にJSTに変換する必要がある。get時のutcへの戻しも
const createSave: CreateSave<Battle> =
  storage =>
  async obj =>
  (await storage.save(NAMESPACE, obj.name, obj));

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

