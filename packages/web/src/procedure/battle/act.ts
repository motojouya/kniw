import type { Battle } from "@motojouya/kniw-core/model/battle";
import type { Turn } from "@motojouya/kniw-core/model/turn";
import type { CharactorBattling } from "@motojouya/kniw-core/model/charactor";
import type { BattleRepository } from "@motojouya/kniw-core/store/battle";
import type { DoSkillForm } from "../../form/battle";
import type { Dialogue } from "../../io/window_dialogue";

import {
  GameOngoing,
  wait,
  stay,
  nextActor,
  isSettlement,
  actToField,
  actToCharactor,
} from "@motojouya/kniw-core/model/battle";

import { toAction, ReceiverDuplicationError } from "../../form/battle";
import { underStatus } from "@motojouya/kniw-core/model/status";
import { sleep } from "@motojouya/kniw-core/store_data/status/index";
import { createRandoms } from "@motojouya/kniw-core/model/random";
import { DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";
import { UserCancel } from "../../io/window_dialogue";

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

  if (!dialogue.confirm("実行していいですか？")) {
    return new UserCancel("Cancelされました");
  }

  if (doAction === null) {
    battle.turns.push(stay(battle, actor, new Date()));
  } else {
    const selectedSkill = doAction.skill;
    const newTurn =
      selectedSkill.type === "SKILL_TO_FIELD"
        ? actToField(battle, actor, selectedSkill, new Date(), createRandoms())
        : actToCharactor(battle, actor, selectedSkill, doAction.receivers, new Date(), createRandoms());
    battle.turns.push(newTurn);
  }

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
      await repository.save(battle);
      return null;
    }

    firstWaiting = nextActor(battle);
    battle.turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));
    battle.result = isSettlement(battle);
    if (battle.result !== GameOngoing) {
      await repository.save(battle);
      return null;
    }
  }

  await repository.save(battle);
  return null;
};
