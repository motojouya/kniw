import type { Field, Climate } from 'src/domain/field';
import type { Charactor } from 'src/domain/charactor';
import type { Skill } from 'src/domain/skill';

import { toCharactor, toCharactorJson, charactorSchema } from 'src/domain/charactor';
import { NotWearableErorr } from 'src/domain/acquirement';
import { getSkill } from 'src/store/skill';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';

import { parse } from 'date-fns';
// import ja from 'date-fns/locale/ja'

export type DoSkill = {
  type: 'DO_SKILL';
  actor: Charactor;
  skill: Skill;
  receivers: Charactor[];
};

export type DoNothing = {
  type: 'DO_NOTHING';
  actor: Charactor;
};

export type Surrender = {
  type: 'SURRENDER';
  actor: Charactor;
};

export type TimePassing = {
  type: 'TIME_PASSING';
  wt: number;
};

export type Action = TimePassing | DoNothing | DoSkill | Surrender;

export type Turn = {
  datetime: Date;
  action: Action;
  sortedCharactors: Charactor[];
  field: Field;
};

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

export type ToTurnJson = (turn: Turn) => TurnJson;
export const toTurnJson: ToTurnJson = turn => ({
  datetime: turn.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  action: toActionJson(turn.action),
  sortedCharactors: turn.sortedCharactors.map(toCharactorJson),
  field: turn.field,
});

export type ToAction = (actionJson: any) => Action | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError;
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

    const receivers: Charactor[] = [];
    for (const receiverJson of actionJson.receivers) {
      const receiver = toCharactor(receiverJson);
      if (
        receiver instanceof NotWearableErorr ||
        receiver instanceof DataNotFoundError ||
        receiver instanceof JsonSchemaUnmatchError
      ) {
        return receiver;
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

export type ToTurn = (turnJson: any) => Turn | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError;
export const toTurn: ToTurn = turnJson => {
  const compile = createValidationCompiler();
  const validateSchema = compile(turnSchema);
  if (!validateSchema(turnJson)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'turnのjsonデータではありません');
  }

  // TODO try catch
  // const datetime = new Date(Date.parse(turnJson.datetime));
  const datetime = parse(turnJson.datetime, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  const action = toAction(turnJson.action);
  if (
    action instanceof NotWearableErorr ||
    action instanceof DataNotFoundError ||
    action instanceof JsonSchemaUnmatchError
  ) {
    return action;
  }

  const sortedCharactors: Charactor[] = [];
  for (const charactorJson of turnJson.sortedCharactors) {
    const charactor = toCharactor(charactorJson);
    if (
      charactor instanceof NotWearableErorr ||
      charactor instanceof DataNotFoundError ||
      charactor instanceof JsonSchemaUnmatchError
    ) {
      return charactor;
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
