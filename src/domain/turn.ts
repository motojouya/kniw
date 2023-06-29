import type { Field, Climate } from 'src/domain/field';
import type { Charactor } from 'src/domain/charactor'
import type { Skill } from 'src/domain/skill'

import {
  createCharactor,
  AcquirementNotFoundError,
  isAcquirementNotFoundError,
  createCharactorJson,
  charactorSchema,
} from 'src/domain/charactor'
import { NotWearableErorr, isNotWearableErorr } from 'src/domain/acquirement'
import { createSkill } from 'src/store/skill'
import { JsonSchemaUnmatchError, isJsonSchemaUnmatchError } from 'src/domain/store';

import { FromSchema } from "json-schema-to-ts";
import { createValidationCompiler } from 'src/io/json_schema';

import { parse } from 'date-fns';
//import ja from 'date-fns/locale/ja'

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

export const actionSchema = { anyOf: [ doSkillSchema, doNothingSchema, timePassingSchema ] } as const;
export type ActionJson = FromSchema<typeof actionSchema>;

export const turnSchema = {
  type: "object",
  properties: {
    datetime: { type: "string", format: "date-time" },
    action: actionSchema,
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

export class SkillNotFoundError {
  constructor(
    public skillName: string,
    public message: string,
  ) {}
}

export function isSkillNotFoundError(obj: any): obj is SkillNotFoundError {
  return obj instanceof SkillNotFoundError;
}

export type CreateActionJson = (action: Action) => ActionJson;
export const createActionJson: CreateActionJson = action => {
  if (action.type === 'DO_SKILL') {
    return {
      type: 'DO_SKILL',
      actor: createCharactorJson(action.actor),
      skill: action.skill.name,
      receivers: action.receivers.map(createCharactorJson),
    };
  }

  if (action.type === 'DO_NOTHING') {
    return {
      type: 'DO_NOTHING',
      actor: createCharactorJson(action.actor),
    };
  }

  return {
    type: 'TIME_PASSING',
    wt: action.wt,
  };
}

export type CreateTurnJson = (turn: Turn) => TurnJson;
export const createTurnJson: CreateTurnJson = turn => ({
  datetime: turn.datetime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  action: createActionJson(turn.action),
  sortedCharactors: turn.sortedCharactors.map(createCharactorJson),
  field: turn.field,
});

export type CreateAction = (actionJson: any) => Action | NotWearableErorr | AcquirementNotFoundError | SkillNotFoundError | JsonSchemaUnmatchError;
export const createAction: CreateAction = actionJson => {

  const compile = createValidationCompiler();
  const validateSchema = compile(actionSchema)
  if (!validateSchema(actionJson)) {
    // @ts-ignore
    const errors = validateSchema.errors;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'actionのjsonデータではありません');
  }

  if (actionJson.type === 'DO_SKILL') {
    const skillActor = createCharactor(actionJson.actor);
    if (isNotWearableErorr(skillActor)
     || isAcquirementNotFoundError(skillActor)
     || isJsonSchemaUnmatchError(skillActor)
    ) {
      return skillActor;
    }

    const receivers: Charactor[] = [];
    for (let receiverJson of actionJson.receivers) {
      const receiver = createCharactor(receiverJson);
      if (isNotWearableErorr(receiver)
       || isAcquirementNotFoundError(receiver)
       || isJsonSchemaUnmatchError(receiver)
      ) {
        return receiver;
      }
      receivers.push(receiver);
    }

    const skill = createSkill(actionJson.skill);
    if (!skill) {
      return new SkillNotFoundError(actionJson.skill, actionJson.skill + 'というskillは存在しません');
    }

    return {
      type: 'DO_SKILL',
      actor: skillActor,
      skill: skill,
      receivers: receivers,
    };
  }

  if (actionJson.type === 'DO_NOTHING') {
    const nothingActor = createCharactor(actionJson.actor);
    if (isNotWearableErorr(nothingActor)
     || isAcquirementNotFoundError(nothingActor)
     || isJsonSchemaUnmatchError(nothingActor)
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

export type CreateTurn = (turnJson: any) => Turn | NotWearableErorr | AcquirementNotFoundError | SkillNotFoundError | JsonSchemaUnmatchError;
export const createTurn: CreateTurn = turnJson => {

  const compile = createValidationCompiler();
  const validateSchema = compile(turnSchema)
  if (!validateSchema(turnJson)) {
    // @ts-ignore
    const errors = validateSchema.errors;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'turnのjsonデータではありません');
  }

  //TODO try catch
  //const datetime = new Date(Date.parse(turnJson.datetime));
  const datetime = parse(turnJson.datetime, 'yyyy-MM-ddTHH:mm:ss', new Date());

  const action = createAction(turnJson.action);
  if (isNotWearableErorr(action)
   || isAcquirementNotFoundError(action)
   || isAcquirementNotFoundError(action)
   || isSkillNotFoundError(action)
   || isJsonSchemaUnmatchError(action)
  ) {
    return action;
  }

  const sortedCharactors: Charactor[] = [];
  for (let charactorJson of turnJson.sortedCharactors) {
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
    climate: (turnJson.field.climate as Climate),
  };

  return {
    datetime,
    action,
    sortedCharactors,
    field,
  };
};

