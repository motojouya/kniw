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

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';
import { acid, quick, sleep, slow } from 'src/data/status';

const arrayLast = <T>(ary: Array<T>): T => ary.slice(-1)[0];

export type GameResult = 'ONGOING' | 'HOME' | 'VISITOR' | 'DRAW';
export const GameOngoing: GameResult = 'ONGOING';
export const GameHome: GameResult = 'HOME';
export const GameVisitor: GameResult = 'VISITOR';
export const GameDraw: GameResult = 'DRAW';

export type Battle = {
  title: string;
  home: Party;
  visitor: Party;
  turns: Turn[];
  result: GameResult;
};

export const battleSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    home: partySchema,
    visitor: partySchema,
    turns: { type: 'array', items: turnSchema },
    result: { enum: [GameOngoing, GameHome, GameVisitor, GameDraw] },
  },
  required: ['title', 'home', 'visitor', 'turns', 'result'],
} as const;

export type BattleJson = FromSchema<typeof battleSchema>;

export type ToBattleJson = (battle: Battle) => BattleJson;
export const toBattleJson: ToBattleJson = battle => ({
  title: battle.title,
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

  const { title } = battleJson;

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
    title,
    home,
    visitor,
    turns,
    result,
  };
};

export type GetLastTurn = (battle: Battle) => Turn;
export const getLastTurn: GetLastTurn = battle => arrayLast(battle.turns);

export type NextActor = (battle: Battle) => Charactor;
export const nextActor: NextActor = battle => arrayLast(battle.turns).sortedCharactors[0];

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
    const statusDiff = left.statuses.length - right.statuses.length;
    if (statusDiff !== 0) {
      return statusDiff;
    }
    // FIXME 最終的に元の並び順という感じだが、これで嫌な挙動した際は対策が必要
    return 0;
  });

export type CreateBattle = (title: string, home: Party, visitor: Party) => Battle;
export const createBattle: CreateBattle = (title, home, visitor) => {
  /* eslint-disable no-param-reassign */
  home.charactors.forEach(charactor => {
    charactor.isVisitor = false;
  });
  visitor.charactors.forEach(charactor => {
    charactor.isVisitor = true;
  });
  /* eslint-enable no-param-reassign */
  return {
    title,
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

export type ActToCharactor = (
  battle: Battle,
  actor: Charactor,
  skill: Skill,
  receivers: Charactor[],
  datetime: Date,
  randoms: Randoms,
) => Turn;
export const actToCharactor: ActToCharactor = (battle, actor, skill, receivers, datetime, randoms) => {
  if (skill.type === 'SKILL_TO_FIELD') {
    throw new Error('invalid skill type');
  }

  if (skill.mpConsumption > actor.mp) {
    throw new Error('mp shortage');
  }

  if (actor.statuses.find(status => status.name === sleep.name)) {
    throw new Error('sleeping');
  }

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

  const resultReceivers = receivers.map(receiver => skill.action(skill, actor, randoms, lastTurn.field, receiver));
  newTurn.sortedCharactors = newTurn.sortedCharactors.map(updateCharactor(resultReceivers));

  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => {
    const newCharactor = {
      ...charactor,
      statuses: [...charactor.statuses],
    };
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      newCharactor.restWt = getPhysical(charactor).WT + skill.additionalWt;
      newCharactor.mp -= skill.mpConsumption;
    }
    return newCharactor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

export type ActToField = (battle: Battle, actor: Charactor, skill: Skill, datetime: Date, randoms: Randoms) => Turn;
export const actToField: ActToField = (battle, actor, skill, datetime, randoms) => {
  if (skill.type === 'SKILL_TO_CHARACTOR') {
    throw new Error('invalid skill type');
  }

  if (skill.mpConsumption > actor.mp) {
    throw new Error('mp shortage');
  }

  if (actor.statuses.find(status => status.name === sleep.name)) {
    throw new Error('sleeping');
  }

  const lastTurn = arrayLast(battle.turns);
  const newTurn: Turn = {
    datetime,
    action: {
      type: 'DO_SKILL',
      actor,
      skill,
      receivers: [],
    },
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };

  newTurn.field = skill.action(skill, actor, randoms, lastTurn.field);

  newTurn.sortedCharactors = newTurn.sortedCharactors.map(charactor => {
    const newCharactor = {
      ...charactor,
      statuses: [...charactor.statuses],
    };
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      newCharactor.restWt = getPhysical(charactor).WT + skill.additionalWt;
      newCharactor.mp -= skill.mpConsumption;
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
    const newCharactor = {
      ...charactor,
      statuses: [...charactor.statuses],
    };
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      newCharactor.restWt = getPhysical(charactor).WT;
    }
    return newCharactor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

export type Surrender = (battle: Battle, actor: Charactor, datetime: Date) => Turn;
export const surrender: Surrender = (battle, actor, datetime) => {
  const lastTurn = arrayLast(battle.turns);
  return {
    datetime,
    action: {
      type: 'SURRENDER',
      actor,
    },
    sortedCharactors: lastTurn.sortedCharactors,
    field: lastTurn.field,
  };
};

type WaitCharactor = (charactor: Charactor, wt: number, randoms: Randoms) => Charactor;
const waitCharactor: WaitCharactor = (charactor, wt, randoms) => {
  const abilities = getAbilities(charactor);
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  const newCharactor = abilities.reduce((charactorAc, ability) => ability.wait(wt, charactorAc, randoms), {
    ...charactor,
  } as Charactor);
  /* eslint-enable @typescript-eslint/no-unsafe-return */

  newCharactor.statuses = newCharactor.statuses
    .map(status => {
      const restWt = status.restWt - wt;
      return {
        ...status,
        restWt,
      };
    })
    .filter(status => status.restWt > 0);

  const wtRate = newCharactor.statuses.find(status => status.name === quick.name) ? 1.5
               : newCharactor.statuses.find(status => status.name === slow.name) ? 0.75
               : 1
  newCharactor.restWt = Math.max(newCharactor.restWt - (wt * wtRate), 0);

  if (newCharactor.statuses.find(status => status.name === acid.name)) {
    newCharactor.hp = Math.max(newCharactor.hp - (wt / 10), 0);
  }

  newCharactor.mp += Math.floor(wt / 10);
  const physical = getPhysical(newCharactor);
  if (newCharactor.mp > physical.MaxMP) {
    newCharactor.mp = physical.MaxMP;
  }

  return newCharactor;
};

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
  if (lastestTurn.action.type === 'SURRENDER') {
    if (lastestTurn.action.actor.isVisitor) {
      return GameHome;
    } else {
      return GameVisitor;
    }
  }

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
