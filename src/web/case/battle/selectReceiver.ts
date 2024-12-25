import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Turn } from '@motojouya/kniw/src/domain/turn';
import type { Skill } from '@motojouya/kniw/src/domain/skill';

import { actToCharactor } from '@motojouya/kniw/src/domain/battle';
import { toReceiver } from '@motojouya/kniw/src/form/battle';
import { createAbsolute } from '@motojouya/kniw/src/domain/random';
import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

export type WillReceiver = { survive: boolean; receiver: CharactorBattling };

export type SelectReceiver = (
  battle: Battle,
  actor: CharactorBattling,
  skill: Skill,
  receiverWithIsVisitor: string,
  lastTurn: Turn,
  actionDate: Date,
) => WillReceiver | DataNotFoundError;
export const selectReceiver: SelectReceiver = (battle, actor, skill, receiverWithIsVisitor, lastTurn, actionDate) => {
  const receiver = toReceiver(receiverWithIsVisitor, lastTurn.sortedCharactors);
  if (receiver instanceof DataNotFoundError) {
    return receiver;
  }

  const newTurn = actToCharactor(battle, actor, skill, [receiver], actionDate, createAbsolute());
  const survivedReceiver = newTurn.sortedCharactors.find(
    charactor => charactor.isVisitor === receiver.isVisitor && charactor.name === receiver.name,
  );

  return {
    receiver,
    survive: !!survivedReceiver,
  };
};
