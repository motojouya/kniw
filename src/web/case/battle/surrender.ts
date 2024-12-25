import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';

import { GameHome, GameVisitor, surrender as domainSurrender } from '@motojouya/kniw/src/domain/battle';
import { UserCancel } from '@motojouya/kniw/src/io/window_dialogue';

export type Surrender = (
  battleRepository: BattleRepository,
  dialogue: Dialogue,
) => (battle: Battle, actor: CharactorBattling, actionDate: Date) => Promise<null | UserCancel>;
export const surrender: Surrender = (battleRepository, dialogue) => async (battle, actor, actionDate) => {
  if (!dialogue.confirm('降参してもよいですか？')) {
    return new UserCancel('降参していません');
  }

  const turn = domainSurrender(battle, actor, actionDate);
  battle.turns.push(turn);
  await battleRepository.save({
    ...battle,
    result: actor.isVisitor ? GameHome : GameVisitor,
  });
  return null;
};
