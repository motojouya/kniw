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
  JsonSchemaUnmatchError,
} from 'src/domain/store';
import type { Randoms } from 'src/domain/random';

import {
  createParty,
  createPartyJson,
  isCharactorDuplicationError,
  partySchema,
} from 'src/domain/party'
import {
  createCharactor,
  isAcquirementNotFoundError,
  getPhysical,
  getAbilities,
  createCharactorJson,
  charactorSchema,
} from 'src/domain/charactor'
import { changeClimate } from 'src/domain/field';
import { isNotWearableErorr } from 'src/domain/acquirement'
import { createSkill } from 'src/domain/skillStore'
import { isJsonSchemaUnmatchError } from 'src/domain/store';

import { FromSchema } from "json-schema-to-ts";
import Ajv from "ajv"

const ajv = new Ajv();

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

export const doSkillSchema = {
  type: "object",
  properties: {
    type: { const: "DO_SKILL" },
    actor: charactorSchema,
    skill: { type: "string" },
    receivers: { type: "array", items: charactorSchema },
  },
  required: ["type", "actor", "skill", "receivers"],
} as const;

export type DoSkillJson = FromSchema<typeof doSkillSchema>;

export const doNothingSchema = {
  type: "object",
  properties: {
    type: { const: "DO_NOTHING" },
    actor: charactorSchema,
  },
  required: ["type", "actor"],
} as const;

export type DoNothingJson = FromSchema<typeof doNothingSchema>;

export const timePassingSchema = {
  type: "object",
  properties: {
    type: { const: "TIME_PASSING" },
    wt: { type: "integer" },
  },
  required: ["type", "wt"],
} as const;

export type TimePassingJson = FromSchema<typeof timePassingSchema>;

const actionSchema = { anyOf: [ doSkillSchema, doNothingSchema, timePassingSchema ] };
export type ActionJson = FromSchema<typeof actionSchema>;
//export type ActionJson = DoSkillJson | DoNothingJson | TimePassingJson

export const turnSchema = {
  type: "object",
  properties: {
    datetime: { type: "string", format: "date-time" },
    action: actionSchema,
    //action: { anyOf: [ doSkillSchema, doNothingSchema, timePassingSchema ] },
    sortedCharactors: { type: "array", items: charactorSchema },
    field: {
      type: "object",
      properties: {
        climate: { type: "string" },
      },
      required: ["climate"],
    },
  },
  required: ["datetime", "action", "sortedCharactors", "field"],
} as const;

export type TurnJson = FromSchema<typeof turnSchema>;

export const battleSchema = {
  type: "object",
  properties: {
    datetime: { type: "string", format: "date-time" },
    home: partySchema,
    visitor: partySchema,
    turns: { type: "array", items: turnSchema },
    result: { enum: [ GameOngoing, GameHome, GameVisitor, GameDraw ] },
  },
  required: ["datetime", "home", "visitor", "turns", "result"],
} as const;

export type BattleJson = FromSchema<typeof battleSchema>;

export type NewBattle = (datetime: Date, home: Party, visitor: Party) => Battle;
export const newBattle: NewBattle = (datetime, home, visitor) => ({
  datetime,
  home,
  visitor,
  turns: [],
  result: GameOngoing,
});

export type CreateAction = (actionJson: any) => Action | NotWearableErorr | AcquirementNotFoundError | JsonSchemaUnmatchError;
export const createAction: CreateAction = actionJson => {

  const validateSchema = ajv.compile(actionSchema)
  const valid = validateSchema(actionJson)
  if (!valid) {
    console.debug(validateSchema.errors);
    return {
      error: validateSchema.errors,
      message: 'actionのjsonデータではありません',
    };
  }
  const validAction = actionJson as ActionJson;


  if (validAction.type === 'DO_SKILL') {
    const skillActor = createCharactor(validAction.actor);
    if (isNotWearableErorr(skillActor)
     || isAcquirementNotFoundError(skillActor)
     || isJsonSchemaUnmatchError(skillActor)
    ) {
      return skillActor;
    }

    const receivers: Charactor[] = [];
    for (let receiverJson of validAction.receivers) {
      const receiver = createCharactor(receiverJson);
      if (isNotWearableErorr(receiver)
       || isAcquirementNotFoundError(receiver)
       || isJsonSchemaUnmatchError(receiver)
      ) {
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

  if (validAction.type === 'DO_NOTHING') {
    const nothingActor = createCharactor(validAction.actor);
    if (isNotWearableErorr(nothingActor)
     || isAcquirementNotFoundError(nothingActor)
     || isJsonSchemaUnmatchError(nothingActor)
    ) {
      return nothingActor;
    }
    return {
      actor: nothingActor,
    };
  }

  if (validAction.type === 'TIME_PASSING') {
    return {
      wt: 0 + validAction.wt,
    };
  }

  //schema validationでtypeを既にチェックして弾いているので到達不能
  return null;
};

export type CreateTurn = (turnJson: any) => Turn | NotWearableErorr | AcquirementNotFoundError | JsonSchemaUnmatchError;
export const createTurn: CreateTurn = turnJson => {

  const validateSchema = ajv.compile(turnSchema)
  const valid = validateSchema(turnJson)
  if (!valid) {
    console.debug(validateSchema.errors);
    return {
      error: validateSchema.errors,
      message: 'turnのjsonデータではありません',
    };
  }
  const validTurn = turnJson as TurnJson;

  //TODO try catch
  const datetime = Date.parse(validTurn.datetime);

  const action = createAction(validTurn.action);
  if (isNotWearableErorr(action)
   || isAcquirementNotFoundError(action)
   || isAcquirementNotFoundError(action)
   || isJsonSchemaUnmatchError(action)
  ) {
    return action;
  }

  const sortedCharactors: Charactor[] = [];
  for (let charactorJson of validTurn.sortedCharactors) {
    const charactor = createCharactor(charactorJson);
    if (isNotWearableErorr(charactor)
     || isAcquirementNotFoundError(charactor)
     || isJsonSchemaUnmatchError(charactor)
    ) {
      return charactor;
    }
    sortedCharactors.push(charactor);
  }

  const field = {
    climate: validTurn.field.climate,
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

export type CreateBattle = (battleJson: any) => Battle | NotWearableErorr | AcquirementNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const createBattle: CreateBattle = battleJson => {

  const validateSchema = ajv.compile(battleSchema)
  const valid = validateSchema(battleJson)
  if (!valid) {
    console.debug(validateSchema.errors);
    return {
      error: validateSchema.errors,
      message: 'battleのjsonデータではありません',
    };
  }
  const validBattle = battleJson as BattleJson;

  //TODO try catch
  const datetime = Date.parse(validBattle.datetime);

  const home = createParty(validBattle.home);
  if (isNotWearableErorr(home)
   || isAcquirementNotFoundError(home)
   || isCharactorDuplicationError(home)
   || isJsonSchemaUnmatchError(home)
  ) {
    return home;
  }

  const visitor = createParty(validBattle.visitor);
  if (isNotWearableErorr(visitor)
   || isAcquirementNotFoundError(visitor)
   || isCharactorDuplicationError(visitor)
   || isJsonSchemaUnmatchError(visitor)
  ) {
    return visitor;
  }

  const turns: Turn[] = [];
  for (let turnJson of validBattle.turns) {
    const turn = createTurn(turnJson);
    if (isNotWearableErorr(turn)
     || isAcquirementNotFoundError(turn)
     || isJsonSchemaUnmatchError(turn)
    ) {
      return turn;
    }
    turns.push(turn);
  }

  const result = validBattle.result;

  return {
    datetime,
    home
    visitor,
    turns,
    result,
  };
};

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

type CreateTurnJson = (turn: Turn) => BattleJson;
const createTurnJson: CreateTurnJson = turn => ({
  datetime: turn.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  action: createActionJson(turn.action),
  sortedCharactors: turn.sortedCharactors.map(createCharactorJson),
  field: turn.field,
});

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

export type Start = (battle: Battle, datetime: Date, randoms: Randoms) => Turn;
export const start: Start = (battle, datetime, randoms) => ({
  datetime,
  action: { wt: 0 },
  sortedCharactors: sortByWT([...battle.home.charactors, ...battle.visitor.charactors]),
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

