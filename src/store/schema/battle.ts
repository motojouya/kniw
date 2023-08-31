import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';
import type { Skill } from 'src/domain/skill';
import type { Randoms } from 'src/domain/random';
import type { Turn } from 'src/domain/turn';

import { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from 'src/io/json_schema';

import { toTurn, toTurnJson, turnSchema } from 'src/store/schema/turn';
import { toParty, toPartyJson, partySchema } from 'src/store/schema/party';

import { MAGIC_TYPE_NONE } from 'src/domain/skill';
import { getPhysical, getAbilities } from 'src/domain/charactor';
import { changeClimate } from 'src/domain/field';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { CharactorDuplicationError } from 'src/domain/party';
import { GameDraw, GameHome, GameResult, GameOngoing, GameVisitor } from 'src/domain/battle';

import { acid, paralysis, quick, silent, sleep, slow } from 'src/data/status';
import { underStatus } from 'src/domain/status';

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
