import type { Field } from 'src/domain/field';
import type {
  Party,
  PartyJson,
  CharactorDuplicationError,
} from 'src/domain/party'
import type {
  Charactor,
  AcquirementNotFoundError,
} from 'src/domain/charactor'
import type { NotWearableErorr } from 'src/domain/acquirement'
import type { Skill } from 'src/domain/skill'
import type {
  CreateSave,
  CreateGet,
  CreateRemove,
  CreateList,
  CreateStore,
} from 'src/domain/store';
import type { Randoms } from 'src/domain/random';

import {
  createParty,
  createPartyJson,
  isCharactorDuplicationError,
} from 'src/domain/party'
import {
  createCharactor,
  isAcquirementNotFoundError,
  getPhysical,
  getAbilities,
  createCharactorJson,
} from 'src/domain/charactor'
import { changeClimate } from 'src/domain/field';
import { isNotWearableErorr } from 'src/domain/acquirement'
import { createSkill } from 'src/domain/skillStore'

const NAMESPACE = 'battle';

export type GameResult = 'ONGOING' | 'HOME' | 'VISITOR' | 'DRAW';
export const GameOngoing: GameResult = 'ONGOING';
export const GameHome: GameResult = 'HOME';
export const GameVisitor: GameResult = 'VISITOR';
export const GameDraw: GameResult = 'DRAW';

export type DoSkill = {
  type: 'DO_SKILL',
  actor: Charactor,
  skill: Skill,
  receivers: Charactor[],
};

export type DoNothing = {
  type: 'DO_NOTHING',
  actor: Charactor,
};

export type TimePassing = {
  type: 'TIME_PASSING',
  wt: number,
};

export type Action = TimePassing | DoNothing | DoSkill;

export type Turn = {
  datetime: Date,
  action: Action,
  sortedCharactors: Charactor[],
  field: Field,
};

export type Battle = {
  datetime: Date,
  home: Party,
  visitor: Party,
  turns: Turn[],
  result: GameResult,
}

export type CreateAction = (actionJson: ActionJson) => Action | NotWearableErorr | AcquirementNotFoundError
export const createAction: CreateAction = actionJson => {
  if (actionJson.type === 'DO_SKILL') {
    const skillActor = createCharactor(actionJson.actor);
    if (isNotWearableErorr(skillActor)) {
      return skillActor;
    }
    if (isAcquirementNotFoundError(skillActor)) {
      return skillActor;
    }

    const receivers: Charactor[] = [];
    for (let receiverJson of actionJson.receivers) {
      const receiver = createCharactor(receiverJson.name, receiverJson.race, receiverJson.blessing, receiverJson.clothing, receiverJson.weapon);
      if (isNotWearableErorr(receiver)) {
        return receiver;
      }
      if (isAcquirementNotFoundError(receiver)) {
        return receiver;
      }
      receivers.push(receiver);
    }
    return {
      actor: skillActor,
      skill: createSkill(actionJson.skill),
      receivers: receivers,
    };
  }
  if (actionJson.type === 'DO_NOTHING') {
    const nothingActor = createCharactor(actionJson.actor);
    if (isNotWearableErorr(nothingActor)) {
      return nothingActor;
    }
    if (isAcquirementNotFoundError(nothingActor)) {
      return nothingActor;
    }
    return {
      actor: nothingActor,
    };
  }
  if (actionJson.type === 'TIME_PASSING') {
    return {
      wt: 0 + actionJson.wt,
    };
  }

};

export type CreateTurn = (turnJson: TurnJson) => Turn | NotWearableErorr | AcquirementNotFoundError;
export const createTurn: CreateTurn = turnJson => {
  const datetime = Date.parse(turnJson.datetime);

  const action = createAction(turnJson.action);
  if (isNotWearableErorr(action)) {
    return action;
  }
  if (isAcquirementNotFoundError(action)) {
    return action;
  }

  const sortedCharactors: Charactor[] = [];
  for (let charactorJson of turnJson.sortedCharactors) {
    const charactor = createCharactor(charactorJson.name, charactorJson.race, charactorJson.blessing, charactorJson.clothing, charactorJson.weapon);
    if (isNotWearableErorr(charactor)) {
      return charactor;
    }
    if (isAcquirementNotFoundError(charactor)) {
      return charactor;
    }
    sortedCharactors.push(charactor);
  }

  const field = {
    climate: turnJson.field.climate,
  };

  return {
    datetime,
    action,
    sortedCharactors,
    field,
  };
}; 

export type PropertyMissingError = {
  json: object,
  propertyName: string,
  message: string,
};

export function isPropertyMissingError(obj: any) obj is PropertyMissingError {
  return !!obj && typeof obj === 'object' && 'json' in obj && 'propertyName' in obj && 'message' in obj;
};

//TODO validationを入れる必要がある。
//tsで型があると思いきやjsonからデータ型を作るところなのでjson propartyが足りてないことは有り得る。
//型で守られていない部分なのでそのバリデーションの実装は必要なのと、各storeで共通のPropertyMissingErrorは用意したい。




export type CreateBattle = (battleJson: BattleJson) => Battle | NotWearableErorr | AcquirementNotFoundError | CharactorDuplicationError;
export const createBattle: CreateBattle = battleJson => {
  const datetime = Date.parse(battleJson.datetime);

  const home = createParty(battleJson.home.name, battleJson.home.charactors);
  if (isNotWearableErorr(home)) {
    return home;
  }
  if (isAcquirementNotFoundError(home)) {
    return home;
  }
  if (isCharactorDuplicationError(home)) {
    return home;
  }

  const visitor = createParty(battleJson.visitor.name, battleJson.visitor.charactors);
  if (isNotWearableErorr(visitor)) {
    return visitor;
  }
  if (isAcquirementNotFoundError(visitor)) {
    return visitor;
  }
  if (isCharactorDuplicationError(visitor)) {
    return visitor;
  }

  const turns: Turn[] = [];
  for (let turnJson of battleJson.turns) {
    const turn = createTurn(turnJson);
    if (isNotWearableErorr(turn)) {
      return turn;
    }
    if (isAcquirementNotFoundError(turn)) {
      return turn;
    }
    turns.push(turn);
  }

  const result = battleJson.result;

  return {
    datetime,
    home
    visitor,
    turns,
    result,
  };
};

export type DoSkillJson = {
  type: 'DO_SKILL',
  actor: CharactorJson,
  skill: string,
  receivers: CharactorJson[],
};

export type DoNothingJson = {
  type: 'DO_NOTHING',
  actor: CharactorJson,
};

export type TimePassingJson = {
  type: 'TIME_PASSING',
  wt: number,
};

export type ActionJson = DoSkillJson | DoNothingJson | TimePassingJson

type CreateActionJson = (action: Action) => ActionJson;
const createActionJson: CreateActionJson = action => {
  if (action.type === 'DO_SKILL') {
    return {
      actor: createCharactorJson(action.actor),
      skill: action.skill.name,
      receivers: action.receivers.map(createCharactorJson),
    };
  }
  if (action.type === 'DO_NOTHING') {
    return {
      actor: createCharactorJson(action.actor),
    };
  }
  if (action.type === 'TIME_PASSING') {
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
  const leftPhysical = getPhysical(left);
  const rightPhysical = getPhysical(right);
  const wtDiff = left.restWt - right.restWt;
  if (wtDiff !== 0) {
    return wtDiff;
  }
  const agiDiff = leftPhysical.AGI - rightPhysical.AGI;
  if (agiDiff !== 0) {
    return agiDiff;
  }
  const avdDiff = leftPhysical.AVD - rightPhysical.AVD;
  if (avdDiff !== 0) {
    return avdDiff;
  }
  const hpDiff = left.hp - right.hp;
  if (hpDiff !== 0) {
    return hpDiff;
  }
  const mpDiff = left.mp - right.mp;
  if (mpDiff !== 0) {
    return mpDiff;
  }
  //TODO restWtが一致しているケースにどういう判断でsort順を決めるか。
  //最終的にランダム、あるいはホーム側が有利になってもいいが、パラメータとか見てなるべく一貫性のあるものにしたい
  return 0;
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
  if (!result) {
    return null;
  }
  return createBattle((result as BattleJson));
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

