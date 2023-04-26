import {
  GameResult,
  Turn,
  Battle,
  createBattle,
  act,
  stay,
  wait,
  start,
  isSettlement,
  createStore,
  arrayLast, //TODO
} from 'src/model/battle';

export const battle = (conversation: Conversation, repository: Repository) => (home: Party, visitor: Party) => {
  const battleStore = createStore<Battle>(repository);
  const battle = createBattle('TODO Date', home, visitor, [], null);
  const turns = battle.turns;

  turns.push(start(home, visitor, 'TODO Date', 'TODO random'));
  while (true) {
    const firstWaiting = arrayLast(turns).sortedCharactors[0];
    turns.push(wait(battle, firstWaiting.restWt, 'TODO Date', 'TODO random'));

    const actor = arrayLast(turns).sortedCharactors[0];
    //TODO actionの確認
    //降参とかもできるので、その分岐も
    //conversation変数からできる感じで
    if (true) {
      turns.push(act(battle, actor, skill, receivers, 'TODO Date', 'TODO random'));
    } else {
      turns.push(stay(battle, actor, 'TODO Date', 'TODO random'));
    }

    battle.result = isSettlement(battle);
    if (battle.result) {
      break;
    }

    battleStore.save(battle);
  }

  battleStore.save(battle);

  //TODO console.logも会話コンテキストに含めたい
  if (!battle.result) {
    console.log('勝負は無効となりました');
  }
  if (battle.result === 'HOME' || battle.result === 'VISITOR') {
    console.log(battle.result + 'プレイヤーの勝利です');
  }
  if (battle.result === 'DRAW') {
    console.log('勝負は引き分けです');
  }
};

