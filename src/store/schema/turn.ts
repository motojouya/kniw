import type { Turn, Action } from 'src/domain/turn';
import type { Climate } from 'src/domain/field';
import type { CharactorBattling } from 'src/domain/charactor';

import { FromSchema } from 'json-schema-to-ts';
import { parse, format } from 'date-fns';
// import ja from 'date-fns/locale/ja'

import { createValidationCompiler } from 'src/io/json_schema';
import { NotWearableErorr } from 'src/domain/acquirement';
import { getSkill } from 'src/store/skill';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { toCharactor, toCharactorJson, charactorSchema } from 'src/store/schema/charactor';
import { isBattlingCharactor } from 'src/domain/charactor';
import { NotBattlingError } from 'src/domain/battle';

export const surrenderSchema = {
  type: 'object',
  properties: {
    type: { const: 'SURRENDER' },
    actor: charactorSchema,
  },
  required: ['type', 'actor'],
} as const;

export type SurrenderJson = FromSchema<typeof surrenderSchema>;

export const doSkillSchema = {
  type: 'object',
  properties: {
    type: { const: 'DO_SKILL' },
    actor: charactorSchema,
    skill: { type: 'string' },
    receivers: { type: 'array', items: charactorSchema },
  },
  required: ['type', 'actor', 'skill', 'receivers'],
} as const;

export type DoSkillJson = FromSchema<typeof doSkillSchema>;

export const doNothingSchema = {
  type: 'object',
  properties: {
    type: { const: 'DO_NOTHING' },
    actor: charactorSchema,
  },
  required: ['type', 'actor'],
} as const;

export type DoNothingJson = FromSchema<typeof doNothingSchema>;

export const timePassingSchema = {
  type: 'object',
  properties: {
    type: { const: 'TIME_PASSING' },
    wt: { type: 'integer' },
  },
  required: ['type', 'wt'],
} as const;

export type TimePassingJson = FromSchema<typeof timePassingSchema>;

export const actionSchema = { anyOf: [doSkillSchema, doNothingSchema, timePassingSchema, surrenderSchema] } as const;
export type ActionJson = FromSchema<typeof actionSchema>;

export const turnSchema = {
  type: 'object',
  properties: {
    datetime: { type: 'string', format: 'date-time' },
    action: actionSchema,
    sortedCharactors: { type: 'array', items: charactorSchema },
    field: {
      type: 'object',
      properties: {
        climate: { type: 'string' },
      },
      required: ['climate'],
    },
  },
  required: ['datetime', 'action', 'sortedCharactors', 'field'],
} as const;

export type TurnJson = FromSchema<typeof turnSchema>;

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
  const compile = createValidationCompiler();
  const validateSchema = compile(actionSchema);
  if (!validateSchema(actionJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'actionのjsonデータではありません');
  }

  if (actionJson.type === 'DO_SKILL') {
    const skillActor = toCharactor(actionJson.actor);
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
    for (const receiverJson of actionJson.receivers) {
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

  if (actionJson.type === 'DO_NOTHING') {
    const nothingActor = toCharactor(actionJson.actor);
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
    wt: 0 + actionJson.wt,
  };
};

export type ToTurn = (
  turnJson: any,
) => Turn | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError | NotBattlingError;
export const toTurn: ToTurn = turnJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(turnSchema);
  if (!validateSchema(turnJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'turnのjsonデータではありません');
  }

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
    action instanceof JsonSchemaUnmatchError ||
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
    climate: turnJson.field.climate as Climate,
  };

  return {
    datetime,
    action,
    sortedCharactors,
    field,
  };
};
