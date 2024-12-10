import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Turn } from '@motojouya/kniw/src/domain/turn';

import type { FromSchema } from 'json-schema-to-ts';
import { createValidationCompiler } from '@motojouya/kniw/src/io/json_schema';

import { toTurn, toTurnJson, turnSchema } from '@motojouya/kniw/src/store/schema/turn';
import { toParty, toPartyJson, partySchema } from '@motojouya/kniw/src/store/schema/party';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { NotBattlingError, GameDraw, GameHome, GameOngoing, GameVisitor } from '@motojouya/kniw/src/domain/battle';
import { CharactorDuplicationError, isBattlingParty } from '@motojouya/kniw/src/domain/party';

export const battleSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    home: partySchema,
    visitor: partySchema,
    turns: { type: 'array', items: turnSchema },
    result: {
      type: 'string',
      enum: [GameOngoing, GameHome, GameVisitor, GameDraw],
    },
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
) =>
  | Battle
  | NotWearableErorr
  | DataNotFoundError
  | CharactorDuplicationError
  | JsonSchemaUnmatchError
  | NotBattlingError;
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
  if (!isBattlingParty(home)) {
    return new NotBattlingError(home, `home party(${home.name})のcharactorにisVisitor propertyがありません`);
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
  if (!isBattlingParty(visitor)) {
    return new NotBattlingError(visitor, `visitor party(${visitor.name})のcharactorにisVisitor propertyがありません`);
  }

  const turns: Turn[] = [];
  for (const turnJson of battleJson.turns) {
    const turn = toTurn(turnJson);
    if (
      turn instanceof NotWearableErorr ||
      turn instanceof DataNotFoundError ||
      turn instanceof JsonSchemaUnmatchError ||
      turn instanceof NotBattlingError
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
