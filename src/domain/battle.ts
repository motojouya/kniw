import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';
import type { Skill } from 'src/domain/skill';
import type { Randoms } from 'src/domain/random';
import type { Turn } from 'src/domain/turn';

import { toTurn, toTurnJson, turnSchema } from 'src/domain/turn';
import { toParty, toPartyJson, CharactorDuplicationError, partySchema } from 'src/domain/party';
import { getPhysical, getAbilities } from 'src/domain/charactor';
import { changeClimate } from 'src/domain/field';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

import { parse } from 'date-fns';
// import ja from 'date-fns/locale/ja'

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';

// TODO util?
const arrayLast = <T>(ary: Array<T>): T => ary.slice(-1)[0];

export type GameResult = 'ONGOING' | 'HOME' | 'VISITOR' | 'DRAW';
export const GameOngoing: GameResult = 'ONGOING';
export const GameHome: GameResult = 'HOME';
export const GameVisitor: GameResult = 'VISITOR';
export const GameDraw: GameResult = 'DRAW';

export type Battle = {
  datetime: Date;
  home: Party;
  visitor: Party;
  turns: Turn[];
  result: GameResult;
};

export const battleSchema = {
  type: 'object',
  properties: {
    datetime: { type: 'string', format: 'date-time' },
    home: partySchema,
    visitor: partySchema,
    turns: { type: 'array', items: turnSchema },
    result: { enum: [GameOngoing, GameHome, GameVisitor, GameDraw] },
  },
  required: ['datetime', 'home', 'visitor', 'turns', 'result'],
} as const;

export type BattleJson = FromSchema<typeof battleSchema>;

export type ToBattleJson = (battle: Battle) => BattleJson;
export const toBattleJson: ToBattleJson = battle => ({
  datetime: battle.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  home: toPartyJson(battle.home),
  visitor: toPartyJson(battle.visitor),
  turns: battle.turns.map(toTurnJson),
  result: battle.result,
});

export type ToBattle = (
  battleJson: any,
) => Battle | NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError;
export const toBattle: ToBattle = battleJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(battleSchema);
  if (!validateSchema(battleJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'battleのjsonデータではありません');
  }

  // TODO try catch
  // const datetime = new Date(Date.parse(battleJson.datetime));
  const datetime = parse(battleJson.datetime, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  const home = toParty(battleJson.home);
  if (
    home instanceof NotWearableErorr ||
    home instanceof DataNotFoundError ||
    home instanceof CharactorDuplicationError ||
    home instanceof JsonSchemaUnmatchError
  ) {
    return home;
  }

  const visitor = toParty(battleJson.visitor);
  if (
    visitor instanceof NotWearableErorr ||
    visitor instanceof DataNotFoundError ||
    visitor instanceof CharactorDuplicationError ||
    visitor instanceof JsonSchemaUnmatchError
  ) {
    return visitor;
  }

  const turns: Turn[] = [];
  for (const turnJson of battleJson.turns) {
    const turn = toTurn(turnJson);
    if (
      turn instanceof NotWearableErorr ||
      turn instanceof DataNotFoundError ||
      turn instanceof JsonSchemaUnmatchError
    ) {
      return turn;
    }
    turns.push(turn);
  }

  const { result } = battleJson;

  return {
    datetime,
    home,
    visitor,
    turns,
    result,
  };
};

type SortByWT = (charactors: Charactor[]) => Charactor[];
const sortByWT: SortByWT = charactors =>
  charactors.sort((left, right) => {
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
    // TODO restWtが一致しているケースにどういう判断でsort順を決めるか。
    // 最終的にランダム、あるいはホーム側が有利になってもいいが、パラメータとか見てなるべく一貫性のあるものにしたい
    return 0;
  });

export type CreateBattle = (datetime: Date, home: Party, visitor: Party) => Battle;
export const createBattle: CreateBattle = (datetime, home, visitor) => {
  // eslint-disable-next-line no-param-reassign
  home.charactors.forEach(charactor => { charactor.isVisitor = false; });
  // eslint-disable-next-line no-param-reassign
  visitor.charactors.forEach(charactor => { charactor.isVisitor = true; });
  return {
    datetime,
    home,
    visitor,
    turns: [],
    result: GameOngoing,
  };
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
    climate: changeClimate(randoms),
  },
});

type UpdateCharactor = (receivers: Charactor[]) => (charactor: Charactor) => Charactor;
const updateCharactor: UpdateCharactor = receivers => charactor => {
  const foundReceiver = receivers.find(receiver => charactor.name === receiver.name);
  if (foundReceiver) {
    return foundReceiver;
  }
  return charactor;
};

export type Act = (
  battle: Battle,
  actor: Charactor,
  skill: Skill,
  receivers: Charactor[],
  datetime: Date,
  randoms: Randoms,
) => Turn;
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
    const newCharactor = { ...charactor };
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      newCharactor.restWt = getPhysical(charactor).WT + skill.additionalWt;
    }
    return newCharactor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

export type Stay = (battle: Battle, actor: Charactor, datetime: Date) => Turn;
export const stay: Stay = (battle, actor, datetime) => {
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
    const newCharactor = { ...charactor };
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      newCharactor.restWt = getPhysical(charactor).WT;
    }
    return newCharactor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

type WaitCharactor = (charactor: Charactor, wt: number, randoms: Randoms) => Charactor;
const waitCharactor: WaitCharactor = (charactor, wt, randoms) => {
  const abilities = getAbilities(charactor);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const newCharactor = abilities.reduce((charactorAc, ability) => ability.wait(wt, charactorAc, randoms), { ...charactor } as Charactor);

  newCharactor.statuses = newCharactor.statuses
    .map(status => {
      const restWt = status.restWt - wt;
      return {
        ...status,
        restWt,
      };
    })
    .filter(status => status.restWt > 0);

  newCharactor.restWt = Math.max(newCharactor.restWt - wt, 0);
  return newCharactor;
};

// ターン経過による状態変化を起こす関数
// これの実装はabilityかあるいはstatusに持たせたほうがいいか。体力の回復とかステータス異常の回復とかなので
export type Wait = (battle: Battle, wt: number, datetime: Date, randoms: Randoms) => Turn;
export const wait: Wait = (battle, wt, datetime, randoms) => {
  const lastTurn = arrayLast(battle.turns);
  const newTurn: Turn = {
    datetime,
    action: {
      type: 'TIME_PASSING',
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
