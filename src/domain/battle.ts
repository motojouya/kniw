import type {
  Field,
  Climate,
} from 'src/domain/field';
import type {
  Party,
  PartyJson,
} from 'src/domain/party'
import type { Charactor } from 'src/domain/charactor'
import type { Skill } from 'src/domain/skill'
import type { Randoms } from 'src/domain/random';
import type {
  Turn,
  TurnJson,
} from 'src/domain/turn';

import {
  createTurn,
  createTurnJson,
  SkillNotFoundError,
  turnSchema,
} from 'src/domain/turn';
import {
  createParty,
  createPartyJson,
  CharactorDuplicationError,
  partySchema,
} from 'src/domain/party'
import {
  AcquirementNotFoundError,
  getPhysical,
  getAbilities,
} from 'src/domain/charactor'
import { changeClimate } from 'src/domain/field';
import { NotWearableErorr } from 'src/domain/acquirement'
import { JsonSchemaUnmatchError } from 'src/store/store';

import { parse } from 'date-fns';
//import ja from 'date-fns/locale/ja'

import { FromSchema } from "json-schema-to-ts";
import { createValidationCompiler } from 'src/io/json_schema';

//TODO util?
const arrayLast = <T>(ary: Array<T>): T => ary.slice(-1)[0];

export type GameResult = 'ONGOING' | 'HOME' | 'VISITOR' | 'DRAW';
export const GameOngoing: GameResult = 'ONGOING';
export const GameHome: GameResult = 'HOME';
export const GameVisitor: GameResult = 'VISITOR';
export const GameDraw: GameResult = 'DRAW';

export type Battle = {
  datetime: Date,
  home: Party,
  visitor: Party,
  turns: Turn[],
  result: GameResult,
}

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

export type CreateBattleJson = (battle: Battle) => BattleJson;
export const createBattleJson: CreateBattleJson = battle => ({
  datetime: battle.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  home: createPartyJson(battle.home),
  visitor: createPartyJson(battle.visitor),
  turns: battle.turns.map(createTurnJson),
  result: battle.result,
});

export type CreateBattle = (battleJson: any) => Battle | NotWearableErorr | AcquirementNotFoundError | CharactorDuplicationError | SkillNotFoundError | JsonSchemaUnmatchError;
export const createBattle: CreateBattle = battleJson => {

  const compile = createValidationCompiler();
  const validateSchema = compile(battleSchema)
  if (!validateSchema(battleJson)) {
    // @ts-ignore
    const errors = validateSchema.errors;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'battleのjsonデータではありません');
  }

  //TODO try catch
  //const datetime = new Date(Date.parse(battleJson.datetime));
  const datetime = parse(battleJson.datetime, 'yyyy-MM-ddTHH:mm:ss', new Date());

  const home = createParty(battleJson.home);
  if (home instanceof NotWearableErorr
   || home instanceof AcquirementNotFoundError
   || home instanceof CharactorDuplicationError
   || home instanceof JsonSchemaUnmatchError
  ) {
    return home;
  }

  const visitor = createParty(battleJson.visitor);
  if (visitor instanceof NotWearableErorr
   || visitor instanceof AcquirementNotFoundError
   || visitor instanceof CharactorDuplicationError
   || visitor instanceof JsonSchemaUnmatchError
  ) {
    return visitor;
  }

  const turns: Turn[] = [];
  for (let turnJson of battleJson.turns) {
    const turn = createTurn(turnJson);
    if (turn instanceof NotWearableErorr
     || turn instanceof AcquirementNotFoundError
     || turn instanceof SkillNotFoundError
     || turn instanceof JsonSchemaUnmatchError
    ) {
      return turn;
    }
    turns.push(turn);
  }

  const result = battleJson.result;

  return {
    datetime,
    home,
    visitor,
    turns,
    result,
  };
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

export type NewBattle = (datetime: Date, home: Party, visitor: Party) => Battle;
export const newBattle: NewBattle = (datetime, home, visitor) => ({
  datetime,
  home,
  visitor,
  turns: [],
  result: GameOngoing,
});

type UpdateCharactor = (receivers: Charactor[]) => (charactor: Charactor) => Charactor;
const updateCharactor: UpdateCharactor = receivers => charactor => {
  const receiver = receivers.find(receiver => charactor.name === receiver.name);
  if (receiver) {
    return receiver;
  }
  return charactor;
}

export type Act = (battle: Battle, actor: Charactor, skill: Skill, receivers: Charactor[], datetime: Date, randoms: Randoms) => Turn
export const act: Act = (battle, actor, skill, receivers, datetime, randoms) => {
  const lastTurn = arrayLast(battle.turns);
  const newTurn: Turn = {
    datetime,
    action: {
      type: 'DO_SKILL',
      actor,
      skill,
      receivers,
    },
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };

  if (skill.type === 'SKILL_TO_FIELD') {
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
  const newTurn: Turn = {
    datetime,
    action: {
      type: 'DO_NOTHING',
      actor,
    },
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
  const newTurn: Turn = {
    datetime,
    action: {
      type: "TIME_PASSING",
      wt,
    },
    sortedCharactors: lastTurn.sortedCharactors,
    field: {
      climate: changeClimate(randoms),
    },
  };
  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => waitCharactor(charactor, wt, randoms));

  return newTurn;
};

export type Start = (battle: Battle, datetime: Date, randoms: Randoms) => Turn;
export const start: Start = (battle, datetime, randoms) => ({
  datetime,
  action: {
    type: 'TIME_PASSING',
    wt: 0,
  },
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

