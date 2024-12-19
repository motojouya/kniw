import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Repository } from '@motojouya/kniw/src/io/repository';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import { NotApplicable } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Turn } from '@motojouya/kniw/src/domain/turn';
import {
  createBattle,
  actToField,
  actToCharactor,
  stay,
  wait,
  start as startBattle,
  isSettlement,
  surrender,
  nextActor,
  GameDraw,
  GameHome,
  GameVisitor,
  GameOngoing,
  getLastTurn,
  NotBattlingError,
} from '@motojouya/kniw/src/domain/battle';
import {
  getSkills,
  getPhysical,
  getAbilities,
  getSelectOption as charactorSelectOption,
  selectCharactor,
} from '@motojouya/kniw/src/domain/charactor';
import { createStore as createBattleStore } from '@motojouya/kniw/src/store/battle';
import { createStore as createPartyStore } from '@motojouya/kniw/src/store/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toParty } from '@motojouya/kniw/src/store/schema/party';
import { createAbsolute, createRandoms } from '@motojouya/kniw/src/domain/random';
import { getSkill } from '@motojouya/kniw/src/store/skill';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { underStatus } from '@motojouya/kniw/src/domain/status';
import { sleep } from '@motojouya/kniw/src/data/status/sleep';
import { MAGIC_TYPE_NONE } from '@motojouya/kniw/src/domain/skill';
import { silent } from '@motojouya/kniw/src/data/status';

const SKILL = 'SKILL';
const LIST = 'LIST';
const CHARACTOR = 'CHARACTOR';
const NOTHING = 'NOTHING';
const INTERRUPTION = 'INTERRUPTION';
const SURRENDER = 'SURRENDER';
const BACK = 'BACK';

type ActSkill = (dialogue: Dialogue) => (actor: CharactorBattling, battle: Battle) => Promise<Turn | null>;
const actSkill: ActSkill = dialogue => async (actor, battle) => {
  const lastTurn = getLastTurn(battle);
  /* eslint-disable no-await-in-loop */
  for (;;) {
    const skills = getSkills(actor);
    const skillOptions = skills
      .filter(skill => skill.mpConsumption <= actor.mp)
      .filter(skill => !underStatus(silent, actor) || skill.magicType === MAGIC_TYPE_NONE)
      .map(skill => ({ value: skill.name, label: skill.name }));
    skillOptions.push({ value: BACK, label: '戻る' });
    const selectedName = await dialogue.select('Skillを選んでください', skillOptions);
    if (selectedName instanceof NotApplicable || selectedName === BACK) {
      return null;
    }

    const selectedSkill = getSkill(selectedName);
    if (!selectedSkill) {
      await dialogue.notice(`${selectedName}というskillはありません`);
      return null;
    }

    if (selectedSkill.type === 'SKILL_TO_FIELD') {
      const newTurn = actToField(battle, actor, selectedSkill, new Date(), createAbsolute());

      await dialogue.notice('効果');
      await dialogue.notice(`天候: ${newTurn.field.climate}`);

      const isExec = await dialogue.confirm('実行しますか？');
      if (!(isExec instanceof NotApplicable) && isExec) {
        return actToField(battle, actor, selectedSkill, new Date(), createRandoms());
      }
    } else {
      const { receiverCount } = selectedSkill;
      const receiverOptions = lastTurn.sortedCharactors.map(receiver => charactorSelectOption(receiver));
      const selectedReceiverNames = await dialogue.multiSelect(
        `対象を${receiverCount}体まで選んでください。未選択でSkillを選び直せます`,
        receiverCount,
        receiverOptions,
      );

      if (selectedReceiverNames instanceof NotApplicable || selectedReceiverNames.length === 0) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const selectedReceivers = selectCharactor(lastTurn.sortedCharactors, selectedReceiverNames);
      if (selectedReceivers.length !== selectedReceiverNames.length) {
        throw new Error('選択したキャラクターが存在しません');
      }

      const newTurn = actToCharactor(battle, actor, selectedSkill, selectedReceivers, new Date(), createAbsolute());

      await dialogue.notice('効果');
      await selectedReceivers.reduce(
        (p, receiver) =>
          p.then(async () => {
            const selectedReceiver = newTurn.sortedCharactors.find(
              charactor => charactor.isVisitor === receiver.isVisitor && charactor.name === receiver.name,
            );
            if (selectedReceiver) {
              await dialogue.notice(`${selectedReceiver.name}: hp: ${selectedReceiver.hp}`);
            }
          }),
        Promise.resolve(),
      );

      const isExec = await dialogue.confirm('実行しますか？');
      if (!(isExec instanceof NotApplicable) && isExec) {
        return actToCharactor(battle, actor, selectedSkill, selectedReceivers, new Date(), createRandoms());
      }
    }
  }
  /* eslint-enable no-await-in-loop */
};

type ShowSortedCharactors = (dialogue: Dialogue) => (battle: Battle) => Promise<void>;
const showSortedCharactors: ShowSortedCharactors = dialogue => async battle => {
  const lastTurn = getLastTurn(battle);
  await dialogue.notice('以下の順番でターンが進みます');
  await lastTurn.sortedCharactors.reduce(
    (p, charactor, index) =>
      p.then(async () => {
        const team = charactor.isVisitor ? 'VISITOR' : 'HOME';
        await dialogue.notice(`${index + 1}. ${charactor.name}(${team}) hp:${charactor.hp} mp:${charactor.mp}`);
      }),
    Promise.resolve(),
  );
};

type ShowCharactorStatus = (dialogue: Dialogue) => (battle: Battle) => Promise<void>;
const showCharactorStatus: ShowCharactorStatus =
  ({ select, notice }) =>
  async battle => {
    const lastTurn = getLastTurn(battle);
    const charactorOptions = lastTurn.sortedCharactors.map(charactor => charactorSelectOption(charactor));
    const selectedCharactorName = await select(`対象を選んでください`, charactorOptions);

    if (selectedCharactorName instanceof NotApplicable || !selectedCharactorName) {
      return;
    }

    const selectedCharactors = selectCharactor(lastTurn.sortedCharactors, [selectedCharactorName]);
    if (selectedCharactors.length !== 1) {
      throw new Error('選択したキャラクターが存在しません');
    }

    const charactor = selectedCharactors[0];
    await notice(`名前: ${charactor.name}`);
    await notice(`HP: ${charactor.hp}`);
    await notice(`MP: ${charactor.mp}`);
    await notice(`WT: ${charactor.restWt}`);

    await notice('ステータス:');
    await charactor.statuses.reduce(
      (p, s) => p.then(() => notice(`  - ${s.status.label}(${s.restWt})`)),
      Promise.resolve(),
    );

    await notice(`種族: ${charactor.race.label}`);
    await notice(`祝福: ${charactor.blessing.label}`);
    await notice(`装備: ${charactor.clothing.label}`);
    await notice(`武器: ${charactor.weapon.label}`);

    const physical = getPhysical(charactor);
    await notice('能力:');
    await notice(`  MaxHP: ${physical.MaxHP}`);
    await notice(`  MaxMP: ${physical.MaxMP}`);
    await notice(`  STR: ${physical.STR}`);
    await notice(`  VIT: ${physical.VIT}`);
    await notice(`  DEX: ${physical.DEX}`);
    await notice(`  AGI: ${physical.AGI}`);
    await notice(`  AVD: ${physical.AVD}`);
    await notice(`  INT: ${physical.INT}`);
    await notice(`  MND: ${physical.MND}`);
    await notice(`  RES: ${physical.RES}`);
    await notice(`  WT: ${physical.WT}`);

    const abilities = getAbilities(charactor);
    await notice('アビリティ:');
    await abilities.reduce((p, ability) => p.then(() => notice(`  - ${ability.label}`)), Promise.resolve());

    const skills = getSkills(charactor);
    await notice('スキル:');
    await skills.reduce((p, skill) => p.then(() => notice(`  - ${skill.label}`)), Promise.resolve());
  };

type PlayerSelect = (dialogue: Dialogue) => (actor: CharactorBattling, battle: Battle) => Promise<Turn | null>;
const playerSelect: PlayerSelect = dialogue => async (actor, battle) => {
  /* eslint-disable no-await-in-loop */
  for (;;) {
    const select = await dialogue.select('どうしますか？', [
      { value: SKILL, label: 'Skillを選ぶ' },
      { value: LIST, label: '一覧を見る' },
      { value: CHARACTOR, label: 'Charactorを見る' },
      { value: NOTHING, label: '何もしない' },
      { value: INTERRUPTION, label: '戦いを中断する' },
      { value: SURRENDER, label: '降参する' },
    ]);

    switch (select) {
      case SKILL: {
        const newTurn = await actSkill(dialogue)(actor, battle);
        if (newTurn) {
          return newTurn;
        }
        break;
      }
      case LIST:
        await showSortedCharactors(dialogue)(battle);
        break;
      case CHARACTOR:
        await showCharactorStatus(dialogue)(battle);
        break;
      case NOTHING:
        return stay(battle, actor, new Date());
      case SURRENDER: {
        const isSurrender = await dialogue.confirm('降参してもよいですか？');
        if (!(isSurrender instanceof NotApplicable) && isSurrender) {
          return surrender(battle, actor, new Date());
        }
        break;
      }
      case INTERRUPTION:
        return null;
      default:
      // 選択されなかった場合
      // do nothing
    }
  }
  /* eslint-enable no-await-in-loop */
};

export type ContinueBattle = (dialogue: Dialogue, repository: Repository) => (battle: Battle) => Promise<void>;
export const continueBattle: ContinueBattle = (dialogue, repository) => async battle => {
  const battleStore = await createBattleStore(repository);
  const { turns } = battle;

  /* eslint-disable no-await-in-loop */
  for (;;) {
    const firstWaiting = nextActor(battle);
    turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));

    const actor = nextActor(battle);

    if (underStatus(sleep, actor)) {
      turns.push(stay(battle, actor, new Date()));
      await battleStore.save(battle);
    } else {
      const turn = await playerSelect(dialogue)(actor, battle);
      if (!turn) {
        break;
      }
      turns.push(turn);
      await battleStore.save(battle);
    }

    // eslint-disable-next-line no-param-reassign
    battle.result = isSettlement(battle);
    if (battle.result !== GameOngoing) {
      break;
    }
  }
  /* eslint-enable no-await-in-loop */

  await battleStore.save(battle);

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
export const start: Start = (dialogue, repository) => async (title, home, visitor) => {
  const partyStore = createPartyStore(repository);

  const homeParty = await partyStore.importJson(home);
  if (
    homeParty instanceof JsonSchemaUnmatchError ||
    homeParty instanceof NotWearableErorr ||
    homeParty instanceof DataNotFoundError ||
    homeParty instanceof CharactorDuplicationError ||
    homeParty instanceof JsonSchemaUnmatchError
  ) {
    await dialogue.notice(`homeのpartyは不正なデータです`);
    return;
  }

  const visitorParty = await partyStore.importJson(visitor);
  if (
    visitorParty instanceof JsonSchemaUnmatchError ||
    visitorParty instanceof NotWearableErorr ||
    visitorParty instanceof DataNotFoundError ||
    visitorParty instanceof CharactorDuplicationError ||
    visitorParty instanceof JsonSchemaUnmatchError
  ) {
    await dialogue.notice(`visitorのpartyは不正なデータです`);
    return;
  }

  const battle = createBattle(title, homeParty, visitorParty);
  battle.turns.push(startBattle(battle, new Date(), createRandoms()));

  await continueBattle(dialogue, repository)(battle);
};

export type Resume = (dialogue: Dialogue, repository: Repository) => (title: string) => Promise<void>;
export const resume: Resume = (dialogue, repository) => async title => {
  const battleStore = await createBattleStore(repository);
  const battle = await battleStore.get(title);
  if (!battle) {
    await dialogue.notice(`${title}というbattleはありません`);
    return;
  }
  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError ||
    battle instanceof NotBattlingError
  ) {
    await dialogue.notice(`${title}のbattleは不正なデータです`);
    return;
  }

  await continueBattle(dialogue, repository)(battle);
};
