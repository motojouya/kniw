import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { readJson } from 'src/io/file_repository';
import { NotApplicable } from 'src/io/standard_dialogue';
import type { Battle } from 'src/domain/battle';
import type { Turn } from 'src/domain/turn';
import {
  createBattle,
  actToField,
  actToCharactor,
  stay,
  wait,
  start as startBattle,
  isSettlement,
  GameDraw,
  GameHome,
  GameVisitor,
  GameOngoing,
  createBattle,
} from 'src/domain/battle';
import { createStore as createBattleStore } from 'src/store/battle';
import {
  createStore as createPartyStore,
  toParty,
} from 'src/store/party';
import { createAbsolute, createRandoms } from 'src/domain/random';
import { getSkill } from 'src/store/skill';

const arrayLast = <T>(ary: Array<T>): T => ary.slice(-1)[0];

const SKILL = 'SKILL';
const LIST = 'LIST';
const CHARACTOR = 'CHARACTOR';
const INTERRUPTION = 'INTERRUPTION';
const SURRENDER = 'SURRENDER';
const BACK = 'BACK';

type ActSkill = (dialogue: Dialogue) => (actor: Charactor, battle: Battle) => Turn | null;
const actSkill: ActSkill = dialogue => (actor, battle) => {
  const lastTurn = arrayLast(battle.turns);
  while (true) {

    const skills = getSkills(actor);
    const skillOptions = skills.map(skill => ({ value: skill.name, label: skill.name }));
    skillOptions.push({ value: 'BACK', label: '戻る' });
    const selectedName = await dialogue.select('Skillを選んでください', skillOptions);
    if (selectedName instanceof NotApplicable || selectedName === BACK) {
      return null;
    }

    const selectedSkill = getSkill(selectedName);
    if (!selectedSkill) {
      await dialogue.notice(`${selectedName}というskillはありません`);
      continue;
    }

    if (selectedSkill.type === 'SKILL_TO_CHARACTOR') {
      const { receiverCount } = selectedSkill;
      const receiverOptions = lastTurn.sortedCharactors.map(receiver => ({ value: receiver.name, label: receiver.name }));
      const selectedReceiverNames = await dialogue.multiSelect(
        `対象を${receiverCount}体まで選んでください。未選択でSkillを選び直せます`,
        receiverCount,
        receiverOptions,
      );

      if (selectedReceiverNames instanceof NotApplicable || selectedReceiverNames.length === 0) {
        continue;
      }

      const selectedReceivers = lastTurn.sortedCharactors.filter(receiver => selectedReceiverNames.includes(receiver.name));
      if (selectedReceivers.length !== selectedReceiverNames.length) {
        throw new Error('選択したキャラクターが存在しません');
      }

      const newTurn = actToCharactor(battle, actor, skill, selectedReceivers, new Date(), createAbsolute());

      await dialogue.notice('効果');
      await Promise.all(selectedReceivers.map(async receiver => {
        selectedReceiver = newTurn.sortedCharactors.find(charactor => charactor.isVisitor === receiver.isVisitor && charactor.name === receiver.name);
        await dialogue.notice(`${selectedReceiver.name}: hp: ${selectedReceiver.hp}`);
      }));

      const isExecute = confirm('実行しますか？');
      if (!isExecute) {
        continue;
      }

      return actToCharactor(battle, actor, skill, selectedReceivers, new Date(), createRandoms());

    } else {
      const newTurn = actToField(battle, actor, selectedSkill, new Date(), createAbsolute());

      await dialogue.notice('効果');
      await dialogue.notice(`天候: ${newTurn.field.climate}`);

      const isExecute = confirm('実行しますか？');
      if (!isExecute) {
        continue;
      }

      return actToField(battle, actor, selectedSkill, new Date(), createRandoms());
    }
  }
};

const playerSelect = (dialogue: Dialogue, actor: Charactor, battle: Battle) => {
  while (true) {
    const select = await dialogue.select('どうしますか？', [
      { value: SKILL, label: 'Skillを選ぶ' },
      { value: LIST, label: '一覧を見る' },
      { value: CHARACTOR, label: 'Charactorを見る' },
      { value: INTERRUPTION, label: '戦いを中断する' },
      { value: SURRENDER, label: '降参する' },
    ]);

    switch (select) {
      case SKILL:
        const newTurn = actSkill(dialogue)(actor, battle);
        if (newTurn) {
          return newTurn;
        }
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

  await dialogue.autoCompleteMultiSelect('');
};

export type ContinueBattle = (dialogue: Dialogue, repository: Repository) => (battle: Battle) => Promise<void>;
export const continueBattle: ContinueBattle = (dialogue, repository) => async battle => {
  const battleStore = await createStore<Battle>(repository);
  const turns = battle.turns;

  while (true) {
    const firstWaiting = arrayLast(turns).sortedCharactors[0];
    turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));

    const actor = arrayLast(turns).sortedCharactors[0];
    // TODO actionの確認
    // 降参とかもできるので、その分岐も
    // dialogue変数からできる感じで
    if (true) {
      turns.push(act(battle, actor, skill, receivers, new Date(), createRandoms()));
    } else {
      turns.push(stay(battle, actor, new Date()));
    }

    battle.result = isSettlement(battle);
    if (battle.result !== GameOngoing) {
      break;
    }

    battleStore.save(battle);
  }

  battleStore.save(battle);

  if (battle.result === GameOngoing) {
    await dialogue.notice('勝負を中断しました');
  }
  if (battle.result === GameHome || battle.result === GameVisitor) {
    await dialogue.notice(`${battle.result}プレイヤーの勝利です`);
  }
  if (battle.result === GameDraw) {
    await dialogue.notice('勝負は引き分けです');
  }
};

export type Start = (
  dialogue: Dialogue,
  repository: Repository,
) => (title: string, home: string, visitor: string) => Promise<void>;
export const start: Start = (dialogue, repository) => (title, home, visitor) => {

  const homeJson = readJson(home);
  if (!homeJson) {
    dialogue.notice(`homeのデータがありません`);
    return;
  }
  const homeParty = toParty(homeJson);
  if (
    homeParty instanceof NotWearableErorr ||
    homeParty instanceof DataNotFoundError ||
    homeParty instanceof CharactorDuplicationError ||
    homeParty instanceof JsonSchemaUnmatchError
  ) {
    dialogue.notice(`homeのpartyは不正なデータです`);
    return;
  }

  const visitorJson = readJson(visitor);
  if (!visitorJson) {
    dialogue.notice(`visitorのデータがありません`);
  }
  const visitorParty = toParty(visitorJson);
  if (
    visitorParty instanceof NotWearableErorr ||
    visitorParty instanceof DataNotFoundError ||
    visitorParty instanceof CharactorDuplicationError ||
    visitorParty instanceof JsonSchemaUnmatchError
  ) {
    dialogue.notice(`visitorのpartyは不正なデータです`);
    return;
  }

  const battle = createBattle(title, home, visitor);
  battle.turns.push(startBattle(battle, new Date(), createRandoms()));

  continueBattle(dialogue, repository)(battle);
};

export type Resume = (dialogue: Dialogue, repository: Repository) => (title: string) => Promise<void>;
export const resume: Resume = (dialogue, repository) => title => {
  const battleStore = createBattleStore(repository);
  const battle = battleStore.get(title);
  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError
  ) {
    dialogue.notice(`${title}のbattleは不正なデータです`);
    return;
  }

  continueBattle(dialogue, repository)(battle);
};
