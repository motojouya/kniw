import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';

import { wait, nextActor, createBattle, start } from '@motojouya/kniw/src/domain/battle';
import { createRandoms } from '@motojouya/kniw/src/domain/random';

type StartBattle = (battleRepository: BattleRepository) => (title: string, homeParty: Party, visitorParty: Party, startDate: Date) => Promise<Battle>;
const startBattle: StartBattle = (battleRepository) => async (title, homeParty, visitorParty, startDate) => {

  const battle = createBattle(title, homeParty, visitorParty);
  const turn = start(battle, startDate, createRandoms());
  battle.turns.push(turn);

  const firstWaiting = nextActor(battle);
  battle.turns.push(wait(battle, firstWaiting.restWt, startDate, createRandoms()));

  await battleRepository.save(battle);

  return battle;
};
