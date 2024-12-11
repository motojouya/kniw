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
  actionJson: any,
) => Action | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError | NotBattlingError;
export const toAction: ToAction = actionJson => {
  const result = actionSchema.safeParse(actionJson);
  if (!result.success) {
    return new JsonSchemaUnmatchError(result.error, 'actionのjsonデータではありません');
  }

  const actionJsonTyped = result.data;

  if (actionJsonTyped.type === 'DO_SKILL') {
    const skillActor = toCharactor(actionJsonTyped.actor);
    if (
      skillActor instanceof NotWearableErorr ||
      skillActor instanceof DataNotFoundError ||
      skillActor instanceof JsonSchemaUnmatchError
    ) {
      return skillActor;
    }

    if (!isBattlingCharactor(skillActor)) {
      return new NotBattlingError(skillActor, `actor(${skillActor.name})にisVisitor propertyがありません`);
    }

    const receivers: CharactorBattling[] = [];
    for (const receiverJson of actionJsonTyped.receivers) {
      const receiver = toCharactor(receiverJson);
      if (
        receiver instanceof NotWearableErorr ||
        receiver instanceof DataNotFoundError ||
        receiver instanceof JsonSchemaUnmatchError
      ) {
        return receiver;
      }
      if (!isBattlingCharactor(receiver)) {
        return new NotBattlingError(receiver, `receiver(${receiver.name})にisVisitor propertyがありません`);
      }
      receivers.push(receiver);
    }

    const skill = getSkill(actionJsonTyped.skill);
    if (!skill) {
      return new DataNotFoundError(actionJsonTyped.skill, 'skill', `${actionJsonTyped.skill}というskillは存在しません`);
    }

    return {
      type: 'DO_SKILL',
      actor: skillActor,
      skill,
      receivers,
    };
  }

  if (actionJsonTyped.type === 'SURRENDER') {
    const surrenderActor = toCharactor(actionJsonTyped.actor);
    if (
      surrenderActor instanceof NotWearableErorr ||
      surrenderActor instanceof DataNotFoundError ||
      surrenderActor instanceof JsonSchemaUnmatchError
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

  if (actionJsonTyped.type === 'DO_NOTHING') {
    const nothingActor = toCharactor(actionJsonTyped.actor);
    if (
      nothingActor instanceof NotWearableErorr ||
      nothingActor instanceof DataNotFoundError ||
      nothingActor instanceof JsonSchemaUnmatchError
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
    wt: 0 + actionJsonTyped.wt,
  };
};

export type ToTurn = (
  turnJson: any,
) => Turn | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError | NotBattlingError;
export const toTurn: ToTurn = turnJson => {
  const result = turnSchema.safeParse(turnJson);
  if (!result.success) {
    return new JsonSchemaUnmatchError(result.error, 'turnのjsonデータではありません');
  }

  const turnJsonTyped = result.data;

  let datetime = null;
  try {
    datetime = parse(turnJsonTyped.datetime, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  } catch (e) {
    return new JsonSchemaUnmatchError(e, '日付が間違っています');
  }

  const action = toAction(turnJsonTyped.action);
  if (
    action instanceof NotWearableErorr ||
    action instanceof DataNotFoundError ||
    action instanceof JsonSchemaUnmatchError ||
    action instanceof NotBattlingError
  ) {
    return action;
  }

  const sortedCharactors: CharactorBattling[] = [];
  for (const charactorJson of turnJsonTyped.sortedCharactors) {
    const charactor = toCharactor(charactorJson);
    if (
      charactor instanceof NotWearableErorr ||
      charactor instanceof DataNotFoundError ||
      charactor instanceof JsonSchemaUnmatchError
    ) {
      return charactor;
    }
    if (!isBattlingCharactor(charactor)) {
      return new NotBattlingError(charactor, `charactor(${charactor.name})にisVisitor propertyがありません`);
    }
    sortedCharactors.push(charactor);
  }

  const field = {
    climate: turnJsonTyped.field.climate as Climate,
  };

  return {
    datetime,
    action,
    sortedCharactors,
    field,
  };
};
