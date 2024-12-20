import type { Turn, Action } from '@motojouya/kniw/src/domain/turn';
import type { Climate } from '@motojouya/kniw/src/domain/field';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';

import { parse, format } from 'date-fns';
// import ja from 'date-fns/locale/ja'

import { z } from 'zod';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { getSkill } from '@motojouya/kniw/src/store/skill';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { toCharactor, toCharactorJson, charactorSchema } from '@motojouya/kniw/src/store/schema/charactor';
import { isBattlingCharactor } from '@motojouya/kniw/src/domain/charactor';
import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';

export const surrenderSchema = z.object({
  type: z.literal('SURRENDER'),
  actor: charactorSchema,
});
export type SurrenderJson = z.infer<typeof surrenderSchema>;

export const doSkillSchema = z.object({
  type: z.literal('DO_SKILL'),
  actor: charactorSchema,
  skill: z.string(),
  receivers: z.array(charactorSchema),
});
export type DoSkillJson = z.infer<typeof doSkillSchema>;

export const doNothingSchema = z.object({
  type: z.literal('DO_NOTHING'),
  actor: charactorSchema,
});
export type DoNothingJson = z.infer<typeof doNothingSchema>;

export const timePassingSchema = z.object({
  type: z.literal('TIME_PASSING'),
  wt: z.number().int(),
});
export type TimePassingJson = z.infer<typeof timePassingSchema>;

const actionSchema = z.discriminatedUnion('type', [doSkillSchema, doNothingSchema, timePassingSchema, surrenderSchema]);
export type ActionJson = z.infer<typeof actionSchema>;

export const turnSchema = z.object({
  datetime: z.string().datetime({ local: true }),
  action: actionSchema,
  sortedCharactors: z.array(charactorSchema),
  field: z.object({
    climate: z.string(),
  }),
});
export type TurnJson = z.infer<typeof turnSchema>;

export type ToActionJson = (action: Action) => ActionJson;
export const toActionJson: ToActionJson = action => {
  if (action.type === 'DO_SKILL') {
    return {
      type: 'DO_SKILL',
      actor: toCharactorJson(action.actor),
      skill: action.skill.name,
      receivers: action.receivers.map(toCharactorJson),
    };
  }

  if (action.type === 'SURRENDER') {
    return {
      type: 'SURRENDER',
      actor: toCharactorJson(action.actor),
    };
  }

  if (action.type === 'DO_NOTHING') {
    return {
      type: 'DO_NOTHING',
      actor: toCharactorJson(action.actor),
    };
  }

  return {
    type: 'TIME_PASSING',
    wt: action.wt,
  };
};

type FormatDate = (date: Date) => string;
const formatDate: FormatDate = date => format(date, "yyyy-MM-dd'T'HH:mm:ss");

export type ToTurnJson = (turn: Turn) => TurnJson;
export const toTurnJson: ToTurnJson = turn => ({
  datetime: formatDate(turn.datetime),
  action: toActionJson(turn.action),
  sortedCharactors: turn.sortedCharactors.map(toCharactorJson),
  field: turn.field,
});

export type ToAction = (
  actionJson: ActionJson,
) => Action | NotWearableErorr | DataNotFoundError | NotBattlingError;
export const toAction: ToAction = actionJson => {
  if (actionJson.type === 'DO_SKILL') {
    const skillActor = toCharactor(actionJson.actor);
    if (
      skillActor instanceof NotWearableErorr ||
      skillActor instanceof DataNotFoundError ||
    ) {
      return skillActor;
    }

    if (!isBattlingCharactor(skillActor)) {
      return new NotBattlingError(skillActor, `actor(${skillActor.name})にisVisitor propertyがありません`);
    }

    const receivers: CharactorBattling[] = [];
    for (const receiverJson of actionJson.receivers) {
      const receiver = toCharactor(receiverJson);
      if (
        receiver instanceof NotWearableErorr ||
        receiver instanceof DataNotFoundError ||
      ) {
        return receiver;
      }
      if (!isBattlingCharactor(receiver)) {
        return new NotBattlingError(receiver, `receiver(${receiver.name})にisVisitor propertyがありません`);
      }
      receivers.push(receiver);
    }

    const skill = getSkill(actionJson.skill);
    if (!skill) {
      return new DataNotFoundError(actionJson.skill, 'skill', `${actionJson.skill}というskillは存在しません`);
    }

    return {
      type: 'DO_SKILL',
      actor: skillActor,
      skill,
      receivers,
    };
  }

  if (actionJson.type === 'SURRENDER') {
    const surrenderActor = toCharactor(actionJson.actor);
    if (
      surrenderActor instanceof NotWearableErorr ||
      surrenderActor instanceof DataNotFoundError ||
    ) {
      return surrenderActor;
    }
    if (!isBattlingCharactor(surrenderActor)) {
      return new NotBattlingError(surrenderActor, `actor(${surrenderActor.name})にisVisitor propertyがありません`);
    }
    return {
      type: 'SURRENDER',
      actor: surrenderActor,
    };
  }

  if (actionJson.type === 'DO_NOTHING') {
    const nothingActor = toCharactor(actionJson.actor);
    if (
      nothingActor instanceof NotWearableErorr ||
      nothingActor instanceof DataNotFoundError ||
    ) {
      return nothingActor;
    }
    if (!isBattlingCharactor(nothingActor)) {
      return new NotBattlingError(nothingActor, `actor(${nothingActor.name})にisVisitor propertyがありません`);
    }
    return {
      type: 'DO_NOTHING',
      actor: nothingActor,
    };
  }

  return {
    type: 'TIME_PASSING',
    wt: 0 + actionJson.wt,
  };
};

export type ToTurn = (
  turnJson: TurnJson,
) => Turn | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError | NotBattlingError;
export const toTurn: ToTurn = turnJson => {
  // TODO date parse不要では？JsonSchemaUnmatchErrorも
  let datetime = null;
  try {
    datetime = parse(turnJson.datetime, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  } catch (e) {
    return new JsonSchemaUnmatchError(e, '日付が間違っています');
  }

  const action = toAction(turnJson.action);
  if (
    action instanceof NotWearableErorr ||
    action instanceof DataNotFoundError ||
    action instanceof NotBattlingError
  ) {
    return action;
  }

  const sortedCharactors: CharactorBattling[] = [];
  for (const charactorJson of turnJson.sortedCharactors) {
    const charactor = toCharactor(charactorJson);
    if (
      charactor instanceof NotWearableErorr ||
      charactor instanceof DataNotFoundError ||
    ) {
      return charactor;
    }
    if (!isBattlingCharactor(charactor)) {
      return new NotBattlingError(charactor, `charactor(${charactor.name})にisVisitor propertyがありません`);
    }
    sortedCharactors.push(charactor);
  }

  const field = {
    climate: turnJson.field.climate as Climate,
  };

  return {
    datetime,
    action,
    sortedCharactors,
    field,
  };
};
