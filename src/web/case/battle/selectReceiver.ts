import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { Turn } from '@motojouya/kniw/src/domain/turn';

import { actToCharactor } from '@motojouya/kniw/src/domain/battle';
import { toReceiver } from '@motojouya/kniw/src/form/battle';
import { createAbsolute } from '@motojouya/kniw/src/domain/random';
import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

export type WillReceiver = { suvive: boolean, receiver: CharactorBattling };

export type SelectReceiver = (receiverWithIsVisitor: string, lastTurn: Turn, actionDate: Date) => WillReceiver | DataNotFoundError;
export const selectReceiver: SelectReceiver = (receiverWithIsVisitor, lastTurn, actionDate) => {

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
    suvive: !!survivedReceiver,
  };
};
