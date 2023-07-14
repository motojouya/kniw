import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import {
  GameResult,
  Turn,
  Battle,
  createBattle,
  act,
  stay,
  wait,
  start as startBattle,
  isSettlement,
  createStore,
  arrayLast, // TODO
  GameOngoing,
  createBattle,
} from 'src/domain/battle';
import { createStore as createBattleStore } from 'src/store/battle';
import { createStore as createPartyStore } from 'src/store/party';

const SKILL = 'SKILL';
const LIST = 'LIST';
const CHARACTOR = 'CHARACTOR';
const INTERRUPTION = 'INTERRUPTION';
const SURRENDER = 'SURRENDER';
const BACK = 'BACK';

const skillSelect = (conversation: Conversation, actor: Charactor, receivers: Charactor[]) => {
  while (true) {
    const skills = getSkills(actor);
    const skillOptions = skills.map(skill => ({ value: skill, label: skill.name }));
    skillOptions.push({ value: 'BACK', label: '戻る' });
    const skill = await conversation.select('Skillを選んでください', skillOptions);
    if (skill === BACK) {
      return;
    }

    const { receiverCount } = skill;
    const receiverOptions = receivers.map(receiver => ({ value: receiver, label: receiver.name }));
    const receivers = await conversation.multiSelect(
      `対象を${receiverCount}体まで選んでください。未選択でSkillを選び直せます`,
      receiverOptions,
    );

    if (receivers.length === 0) {
      continue;
    }

    console.log(); // 効果を表示

    const isExecute = confirm();

    if (!isExecute) {
      continue;
    } else {
      return; // something
    }
  }
};

const playerSelect = (conversation: Conversation, actor: Charactor) => {
  while (true) {
    const select = await conversation.select('どうしますか？', [
      { value: 'SKILL', label: 'Skillを選ぶ' },
      { value: 'LIST', label: '一覧を見る' },
      { value: 'CHARACTOR', label: 'Charactorを見る' },
      { value: 'INTERRUPTION', label: '戦いを中断する' },
      { value: 'SURRENDER', label: '降参する' },
    ]);

    switch (select) {
      case SKILL:
        break;
      case LIST:
        break;
      case CHARACTOR:
        break;
      case INTERRUPTION:
        break;
      case SURRENDER:
        break;
      default: // do nothing
    }
  }

  await conversation.autoCompleteMultiSelect('');
};

export type Start = (
  dialogue: Dialogue,
  repository: Repository,
) => (title: string, home: string, visitor: string) => Promise<void>;
export const start: Start = (dialogue, repository) => (home, visitor) => {
  const battle = createBattle(title, home, visitor);
  battle.turns.push(startBattle(battle, 'TODO Date', 'TODO random'));

  continueBattle(conversation, repository)(battle);
};

export type Resume = (dialogue: Dialogue, repository: Repository) => (title: string) => Promise<void>;
export const resume: Resume = (dialogue, repository) => battleJson => {
  continueBattle(conversation, repository)(createBattle(battleJson));
};

export type ContinueBattle = (conversation: Conversation, repository: Repository) => (battle: Battle) => Promise<void>;
export const continueBattle: ContinueBattle = (conversation, repository) => async battle => {
  const battleStore = await createStore<Battle>(repository);
  while (true) {
    const firstWaiting = arrayLast(turns).sortedCharactors[0];
    turns.push(wait(battle, firstWaiting.restWt, 'TODO Date', 'TODO random'));

    const actor = arrayLast(turns).sortedCharactors[0];
    // TODO actionの確認
    // 降参とかもできるので、その分岐も
    // conversation変数からできる感じで
    if (true) {
      turns.push(act(battle, actor, skill, receivers, 'TODO Date', 'TODO random'));
    } else {
      turns.push(stay(battle, actor, 'TODO Date'));
    }

    battle.result = isSettlement(battle);
    if (battle.result) {
      break;
    }

    battleStore.save(battle);
  }

  battleStore.save(battle);

  // TODO console.logも会話コンテキストに含めたい
  if (!battle.result) {
    console.log('勝負は無効となりました');
  }
  if (battle.result === 'HOME' || battle.result === 'VISITOR') {
    console.log(`${battle.result}プレイヤーの勝利です`);
  }
  if (battle.result === 'DRAW') {
    console.log('勝負は引き分けです');
  }
};
