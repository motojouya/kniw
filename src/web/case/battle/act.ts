import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Turn } from '@motojouya/kniw/src/domain/turn';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';
import type { DoSkillForm } from '@motojouya/kniw/src/form/battle';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';

import {
  GameOngoing,
  wait,
  stay,
  nextActor,
  isSettlement,
  actToField,
  actToCharactor,
} from '@motojouya/kniw/src/domain/battle';

import { toAction, ReceiverDuplicationError } from '@motojouya/kniw/src/form/battle';
import { underStatus } from '@motojouya/kniw/src/domain/status';
import { sleep } from '@motojouya/kniw/src/data/status';
import { createRandoms } from '@motojouya/kniw/src/domain/random';
import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { UserCancel } from '@motojouya/kniw/src/io/window_dialogue';

export type Act = (
  dialogue: Dialogue,
  repository: BattleRepository,
) => (
  battle: Battle,
  actor: CharactorBattling,
  doSkillForm: DoSkillForm,
  lastTurn: Turn,
) => Promise<null | DataNotFoundError | ReceiverDuplicationError | UserCancel>;
export const act: Act = (dialogue, repository) => async (battle, actor, doSkillForm, lastTurn) => {
  const doAction = toAction(doSkillForm, lastTurn.sortedCharactors);
  if (doAction instanceof DataNotFoundError || doAction instanceof ReceiverDuplicationError) {
    return doAction;
  }

  if (!dialogue.confirm('実行していいですか？')) {
    return new UserCancel('Cancelされました');
  }

  if (doAction === null) {
    battle.turns.push(stay(battle, actor, new Date()));
  } else {
    const selectedSkill = doAction.skill;
    const newTurn =
      selectedSkill.type === 'SKILL_TO_FIELD'
        ? actToField(battle, actor, selectedSkill, new Date(), createRandoms())
        : actToCharactor(battle, actor, selectedSkill, doAction.receivers, new Date(), createRandoms());
    battle.turns.push(newTurn);
  }

  /* eslint-disable no-param-reassign */
  battle.result = isSettlement(battle);
  if (battle.result !== GameOngoing) {
    await repository.save(battle);
    return null;
  }

  let firstWaiting = nextActor(battle);
  battle.turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));

  battle.result = isSettlement(battle);
  if (battle.result !== GameOngoing) {
    await repository.save(battle);
    return null;
  }

  while (underStatus(sleep, firstWaiting)) {
    battle.turns.push(stay(battle, firstWaiting, new Date()));
    battle.result = isSettlement(battle);
    if (battle.result !== GameOngoing) {
      // eslint-disable-next-line no-await-in-loop
      await repository.save(battle);
      return null;
    }

    firstWaiting = nextActor(battle);
    battle.turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));
    battle.result = isSettlement(battle);
    if (battle.result !== GameOngoing) {
      // eslint-disable-next-line no-await-in-loop
      await repository.save(battle);
      return null;
    }
  }
  /* eslint-disable no-param-reassign */

  await repository.save(battle);
  return null;
};
