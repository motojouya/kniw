import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';
import type { Skill } from 'src/domain/skill';
import type { Randoms } from 'src/domain/random';
import type { Turn } from 'src/domain/turn';

import { MAGIC_TYPE_NONE } from 'src/domain/skill';
import { getPhysical, getAbilities } from 'src/domain/charactor';
import { changeClimate } from 'src/domain/field';

import { acid, paralysis, quick, silent, sleep, slow } from 'src/data/status';
import { underStatus } from 'src/domain/status';

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

export type GetLastTurn = (battle: Battle) => Turn;
export const getLastTurn: GetLastTurn = battle => arrayLast(battle.turns);

export type NextActor = (battle: Battle) => Charactor;
export const nextActor: NextActor = battle => arrayLast(battle.turns).sortedCharactors[0];

type SortByWT = (charactors: Charactor[]) => Charactor[];
const sortByWT: SortByWT = charactors =>
  charactors.filter(charactor => charactor.hp > 0).sort((left, right) => {
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
      statuses: [...charactor.statuses.map(attachedStatus => ({ ...attachedStatus }))],
    };
    if (actor.isVisitor === charactor.isVisitor && actor.name === charactor.name) {
      newCharactor.restWt = getPhysical(charactor).WT;
    }
    return newCharactor;
  });
  newTurn.sortedCharactors = sortByWT(newTurn.sortedCharactors);

  return newTurn;
};

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

  if (underStatus(silent, actor) && skill.magicType !== MAGIC_TYPE_NONE) {
    throw new Error('silent cannot do magic');
  }

  if (underStatus(sleep, actor)) {
    return stay(battle, actor, datetime);
  }

  // FIXME 動けなかった際に麻痺が理由とかそういうのわかるとよい
  if (underStatus(paralysis, actor) && randoms.accuracy > 0.5) {
    return stay(battle, actor, datetime);
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
      statuses: [...charactor.statuses.map(attachedStatus => ({ ...attachedStatus }))],
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

  if (underStatus(silent, actor) && skill.magicType !== MAGIC_TYPE_NONE) {
    throw new Error('silent cannot do magic');
  }

  if (underStatus(sleep, actor)) {
    return stay(battle, actor, datetime);
  }

  // FIXME 動けなかった際に麻痺が理由とかそういうのわかるとよい
  if (underStatus(paralysis, actor) && randoms.accuracy > 0.5) {
    return stay(battle, actor, datetime);
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
      statuses: [...charactor.statuses.map(attachedStatus => ({ ...attachedStatus }))],
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
    statuses: [...charactor.statuses.map(attachedStatus => ({ ...attachedStatus }))],
  } as Charactor);
  /* eslint-enable @typescript-eslint/no-unsafe-return */

  /* eslint-disable no-nested-ternary */
  // prettier-ignore
  const wtRate = underStatus(quick, newCharactor) ? 1.5
    : underStatus(slow, newCharactor) ? 0.75
    : 1;
  /* eslint-enable no-nested-ternary */
  newCharactor.restWt = Math.max(newCharactor.restWt - wt * wtRate, 0);

  if (underStatus(acid, newCharactor)) {
    newCharactor.hp = Math.max(newCharactor.hp - wt / 10, 0);
  }

  newCharactor.statuses = newCharactor.statuses
    .map(attachedStatus => {
      const restWt = attachedStatus.restWt - wt;
      return {
        ...attachedStatus,
        restWt,
      };
    })
    .filter(attachedStatus => attachedStatus.restWt > 0);

  const physical = getPhysical(newCharactor);
  newCharactor.mp = Math.min(newCharactor.mp + Math.floor(wt / 10), physical.MaxMP);

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
