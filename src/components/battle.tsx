import type { FC, ReactNode } from 'react';
import type { Battle, GameResult } from 'src/domain/battle';
import type { BattleForm } from 'src/form/battle';
import type { Store } from 'src/store/store';
import type { DoSkillForm, DoAction } from 'src/form/battle';

import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw,
} from 'src/domain/battle';
import { CharactorDetail } from 'src/components/charactor';
import { useState } from 'react';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  List,
  ListItem,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { battleFormSchema, toBattleForm, saveBattle } from 'src/form/battle';
import { importJson } from 'src/io/indexed_db_repository';
import { toParty as jsonToParty } from 'src/store/schema/party';
import { skillSelectOption, receiverSelectOption, toAction, CharactorDuplicationError as CharactorDuplicationInSelectError } from 'src/form/battle';
import { getSkill } from 'src/store/skill';

import { CharactorDuplicationError } from 'src/domain/party';
import { createRandoms } from 'src/domain/random';
import { start, createBattle } from 'src/domain/battle';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError, DataExistError } from 'src/store/store';

const arrayLast = <T>(ary: Array<T>): T => ary.slice(-1)[0];

type BattleStore = Store<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

const getGameResult = (result: GameResult) => {
  switch (result) {
    case GameHome: return <Text>HOME側の勝利</Text>;
    case GameVisitor: return <Text>VISITOR側の勝利</Text>;
    case GameDraw: return <Text>引き分け</Text>;
    default: return null;
  }
};

const BattleTurn: FC<{ battle: Battle, setBattle, store: BattleStore }> = ({ battle, setBattle, store }) => {

  const lastTurn = arrayLast(battle.turns);
  const actor = nextActor(battle);

  const skills = getSkills(actor);
  const skillOptions = skills
    .filter(skill => skill.mpConsumption <= actor.mp)
    .filter(skill => !underStatus(silent, actor) || skill.magicType === MAGIC_TYPE_NONE)
    .map(skill => ({ value: skill.name, label: skill.name }));
  skillOptions.push({ value: BACK, label: '戻る' });

  const receiverOptions = lastTurn.sortedCharactors.map(receiverSelectOption);

  const router = useRouter()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    control,
  } = useForm<DoSkillForm>({ resolver: ajvResolver<DoSkillForm>(doSkillFormSchema) });
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'receiversWithIsVisitor' });
  const [message, setMessage] = useState<string>('');
  const [expectedTurn, setExpectedTurn] = useState<Turn | null>(null);

  const actSkill = async (doSkillForm: any) => {
    const doAction = toAction(doSkillForm);
    if (doAction instanceof JsonSchemaUnmatchError || doAction instanceof DataNotFoundError) {
      setMessage('入力してください');
      return;
    }
    if (doAction instanceof CharactorDuplicationInSelectError) {
      setMessage(doAction.message);
      return;
    }

    if (!window.confirm('実行していいですか？')) {
      return;
    }

    if (doAction === null) {
      battle.turns.push(stay(battle, actor, new Date()));
    } else {
      const selectedSkill = doAction.skill;
      const newTurn = selectedSkill.type === 'SKILL_TO_FIELD'
        ? actToField(battle, actor, selectedSkill, new Date(), createRandoms())
        : actToCharactor(battle, actor, selectedSkill, doAction.receivers, new Date(), createRandoms());
      battle.turns.push(newTurn);
    }

    const firstWaiting = nextActor(battle);
    battle.turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));

    if (underStatus(sleep, firstWaiting)) {
      battle.turns.push(stay(battle, actor, new Date()));
      const nextWaiting = nextActor(battle);
      battle.turns.push(wait(battle, nextWaiting.restWt, new Date(), createRandoms()));
    }

    await store.save(battle);
    setBattle(battle);
  };

  const onBlurSkill = () => {
    const skillName = getValues('skillName');
    const skill = getSkill(skillName);
    if (!skill) {
      replace([]);
      return;
    }

    if (!skill.receiverCount) {
      replace([]);
      return;
    }

    const receiversWithIsVisitor = Array(skill.receiverCount).fill().map(_ => '');
    replace(receiversWithIsVisitor);
  };

  const onBlurReceiver = () => {
    // TODO 効果を表示する。confirm前にrandomがabsoluteな結果を表示しておく
  };

  const doSurrender = async () => {
    if (window.confirm('降参してもよいですか？')) {
      const turn = surrender(battle, actor, new Date());
      battle.turns.push(turn);
      await store.save(battle);
      setBattle(battle);
    }
  };

  const gameResult = getGameResult(battle.result);

  return (
    <Box p={4}>
      <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      <Text>This is the battle page</Text>
      {battle.result !== GameOngoing && <Button type="button" onClick={() => store.exportJson(battle.title)} >Export</Button>}
      {gameResult}
      <form onSubmit={handleSubmit(actSkill)}>
        {message && (<FormErrorMessage>{message}</FormErrorMessage>)}
        {battle.result === GameOngoing && <Button type="button" onClick={doSurrender} >降参</Button>}
        <Box as={'dl'}>
          <Heading as={'dt'}>battle title</Heading>
          <Text as={'dd'}>{battleForm.title}</Text>
        </Box>
        <FormControl isInvalid={!!error.skillName}>
          <FormLabel htmlFor='skill'>skill</FormLabel>
          <Select  {...register('skillName', { onBlur: onBlurSkill })} placeholder='skill'>
            {skillOptions.map(skillOption => (
              <option key={`${skillOption.value}`} value={skillOption.value}>
                {skillOption.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{!!error && error.skillName}</FormErrorMessage>
        </FormControl>
        <List>
          {fields.map((item, index) => (
            <ListItem key={`receiversWithIsVisitor.${index}`}>
              <FormControl isInvalid={!!error.skillName}>
                <FormLabel htmlFor={`receiversWithIsVisitor.${index}` as const}>receiver</FormLabel>
                <Select  {...register(`receiversWithIsVisitor.${index}` as const)} placeholder='skill'>
                  {receiverOptions.map(receiverOption => (
                    <option key={`${receiverOption.value}`} value={receiverOption.value}>
                      {receiverOption.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Box>
                TODO ダメージ表示
              </Box>
            </ListItem>
          ))}
        </List>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">{exist ? 'Change' : 'Create'}</Button>
      </form>
      <Box>
        <List>
          {lastTurn.sortedCharactors.map(charactor => (
            <ListItem>
              <CharactorDetail charactor={charactor}>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export const BattleExsiting: FC<{ store: BattleStore, battleTitle: string }> = ({ store, battleTitle }) => {
  const battle = useLiveQuery(() => store.get(battleTitle), [battleTitle]);

  if (!store.exportJson) {
    throw new Error('invalid store');
  }

  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError
  ) {
    return (
      <Box>
        <Text>{battle.message}</Text>
        <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      </Box>
    );
  }

  if (!battle) {
    return (
      <Box>
        <Text>{`${battleTitle}というbattleは見つかりません`}</Text>
        <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      </Box>
    );
  }

  return (
    <BattleTurn battle={battle} store={store} />
  );
};

export const BattleNew: FC<{ store: BattleStore }> = ({ store }) => {

  const router = useRouter()

  const [message, setMessage] = useState<string>('');
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<{ title: string }>();
  const [homeParty, setHomeParty] = useState<Party | null>(null);
  const [visitorParty, setVisitorParty] = useState<Party | null>(null);

  const importParty = (type: string) => async () => {
    const partyJson = await importJson();
    if (!partyJson) {
      return;
    }

    const party = jsonToParty(partyJson);
    if (
      party instanceof NotWearableErorr ||
      party instanceof DataNotFoundError ||
      party instanceof CharactorDuplicationError ||
      party instanceof JsonSchemaUnmatchError
    ) {
      window.alert(party.message);
      return;
    }

    if (type === 'home') {
      setHomeParty(party);
    } else if (type === 'visitor') {
      setVisitorParty(party);
    }
    throw new Error('type is invalid');
  };

  const startBattle = async (battleTitle: any) => {
    const messages = [];

    const title = battleTitle.title;
    if (!title) {
      messages.push('titleを入力してください');
    }
    if (!homeParty) {
      messages.push('home partyを入力してください');
    }
    if (!visitorParty) {
      messages.push('visitor partyを入力してください');
    }

    if (messages.length > 0) {
      setMessage(messages.join('\n'));
      return;
    }

    const battle = createBattle(title, homeParty, visitorParty);
    const turn = start(battle, new Date(), createRandoms());
    battle.turns.push(turn);

    const firstWaiting = nextActor(battle);
    battle.turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));

    await store.save(battle);
    await router.push({ pathname: 'battle', query: { title: battle.title } })
  };

  return (
    <Box p={4}>
      <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      <Text>This is the battle page</Text>
      <form onSubmit={handleSubmit(startBattle)}>
        {message && (<FormErrorMessage>{message}</FormErrorMessage>)}
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">title</FormLabel>
          <Input id="title" placeholder="title" {...register('title')} />
          <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
        </FormControl>
        <Box>
          {homeParty && <Text>{`HOME Party: ${homeParty.name}`}</Text>}
          <Button type="button" onClick={importParty('home')} >Select Home Party</Button>
        </Box>
        <Box>
          {visitorParty && <Text>{`VISITOR Party: ${visitorParty.name}`}</Text>}
          <Button type="button" onClick={importParty('visitor')} >Select Visitor Party</Button>
        </Box>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">Start Battle</Button>
      </form>
    </Box>
  );
};

export const BattleList: FC<{ store: BattleStore }> = ({ store }) => {
  const battleNames = useLiveQuery(() => store.list(), []);
  return (
    <Box>
      <Link href={{ pathname: '/' }}><a>戻る</a></Link>
      <Box>
        <List>
          <ListItem key='battle-new'>
            <Link href={{ pathname: 'battle', query: { name: '__new' } }}><a>新しく作る</a></Link>
          </ListItem>
          {battleNames && battleNames.map((battleTitle, index) => (
            <ListItem key={`battle-${index}`}>
              <Link href={{ pathname: 'battle', query: { name: battleTitle } }}><a>{battleTitle}</a></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

