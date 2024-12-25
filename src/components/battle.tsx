import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { Skill } from '@motojouya/kniw/src/domain/skill';
import type { Turn } from '@motojouya/kniw/src/domain/turn';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';
import type { DoSkillForm, DoAction } from '@motojouya/kniw/src/form/battle';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  useFieldArray,
//  FieldError,
  FieldErrors,
//  Merge,
//  FieldErrorsImpl,
  UseFormRegister,
//  UseFormRegisterReturn,
  UseFormGetValues,
  UseFieldArrayReplace,
} from 'react-hook-form';
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
  Tag,
  Select,
} from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import {
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw,
  wait,
  stay,
  nextActor,
  isSettlement,
  actToField,
  actToCharactor,
  createBattle,
  start,
  getLastTurn,
  NotBattlingError,
} from '@motojouya/kniw/src/domain/battle';
import { CharactorDetail } from '@motojouya/kniw/src/components/charactor';
import { ImportParty } from '@motojouya/kniw/src/components/party';
import {
  doSkillFormSchema,
  receiverSelectOption,
  toReceiver,
  toAction,
  ReceiverDuplicationError,
} from '@motojouya/kniw/src/form/battle';
import { ACTION_DO_NOTHING } from '@motojouya/kniw/src/domain/turn';
import { getSkills, isVisitorString } from '@motojouya/kniw/src/domain/charactor';
import { skillRepository } from '@motojouya/kniw/src/store/skill';
import { MAGIC_TYPE_NONE } from '@motojouya/kniw/src/domain/skill';

import { underStatus } from '@motojouya/kniw/src/domain/status';
import { sleep, silent } from '@motojouya/kniw/src/data/status';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { createRandoms, createAbsolute } from '@motojouya/kniw/src/domain/random';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { act } from '@motojouya/kniw/src/web/case/battle/act';
import { surrender } from '@motojouya/kniw/src/web/case/battle/surrender';
import { UserCancel } from '@motojouya/kniw/src/io/window_dialogue';
import { useIO } from '@motojouya/kniw/src/components/context';

const GameResultView: FC<{ battle: Battle }> = ({ battle }) => {
  const card = `${battle.home.name}(HOME) vs ${battle.visitor.name}(VISITOR)`;
  switch (battle.result) {
    case GameHome: return <Text>{`${card} HOME側の勝利`}</Text>;
    case GameVisitor: return <Text>{`${card} VISITOR側の勝利`}</Text>;
    case GameDraw: return <Text>{`${card} 引き分け`}</Text>;
    default: return <Text>{card}</Text>;
  }
};

const ReceiverSelect: FC<{
  battle: Battle,
  actor: CharactorBattling,
  lastTurn: Turn,
  skill: Skill,
  index: number,
  getValues: UseFormGetValues<DoSkillForm>,
  register: UseFormRegister<DoSkillForm>,
}> = ({ battle, actor, lastTurn, skill, index, getValues, register }) => {

  const formItemName = `receiversWithIsVisitor.${index}.value` as const;
  const [receiverResult, setReceiverResult] = useState<CharactorBattling | string | null>(null);

  const onBlur = () => {
    const receiverWithIsVisitor = getValues(formItemName);
    const receiver = toReceiver(receiverWithIsVisitor, lastTurn.sortedCharactors);
    if (receiver instanceof DataNotFoundError) {
      setReceiverResult(null);
      return;
    }

    const newTurn = actToCharactor(battle, actor, skill, [receiver], new Date(), createAbsolute());
    const receiverWill = newTurn.sortedCharactors.find(
      charactor => charactor.isVisitor === receiver.isVisitor && charactor.name === receiver.name,
    );

    if (!receiverWill) {
      setReceiverResult(`${receiver.name} will dead`);
    }
    setReceiverResult(receiverWill || null);
  };

  const receiverOptions = lastTurn.sortedCharactors.map(receiverSelectOption);

  return (
    <Box>
      <FormControl>
        <FormLabel htmlFor={formItemName}>receiver</FormLabel>
        <Select  {...register(formItemName, { onBlur })} placeholder='receiver'>
          {receiverOptions.map(receiverOption => (
            <option key={`${receiverOption.value}`} value={receiverOption.value}>
              {receiverOption.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <Box>
        {receiverResult && (typeof receiverResult === 'string' ? receiverResult : <CharactorDetail charactor={receiverResult} />)}
      </Box>
    </Box>
  );
};

const Surrender: FC<{ battle: Battle, actor: CharactorBattling }> = ({ battle, actor }) => {
  const { battleRepository, dialogue } = useIO();
  // FIXME 降参した後にbattleの状態を変化させる気がするがどうかな
  const doSurrender = () => surrender(battleRepository, dialogue)(battle, actor, new Date());

  return <Button type="button" onClick={doSurrender} >降参</Button>;
};

const SkillSelect: FC<{
  actor: CharactorBattling,
  replace: UseFieldArrayReplace<DoSkillForm, 'receiversWithIsVisitor'>
  getValues: UseFormGetValues<DoSkillForm>,
  register: UseFormRegister<DoSkillForm>,
  errors: FieldErrors<DoSkillForm>,
}> = ({ actor, replace, getValues, register, errors }) => {

  const skills = getSkills(actor);
  const skillOptions = skills
    .filter(skill => skill.mpConsumption <= actor.mp)
    .filter(skill => !underStatus(silent, actor) || skill.magicType === MAGIC_TYPE_NONE)
    .map(skill => ({ value: skill.name, label: skill.name }));
  skillOptions.push({ value: ACTION_DO_NOTHING, label: '何もしない' });

  const onBlur = () => {
    const skillName = getValues('skillName');
    if (skillName === ACTION_DO_NOTHING) {
      replace([]);
      return;
    }

    const skill = skillRepository.get(skillName);
    if (!skill || !skill.receiverCount) {
      replace([]);
      return;
    }

    const receiversWithIsVisitor = Array(skill.receiverCount).fill('');
    replace(receiversWithIsVisitor);
  };

  return (
    <FormControl isInvalid={!!errors.skillName}>
      <FormLabel htmlFor='skill'>skill</FormLabel>
      <Select  {...register('skillName', { onBlur })} placeholder='skill'>
        {skillOptions.map(skillOption => (
          <option key={`${skillOption.value}`} value={skillOption.value}>
            {skillOption.label}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{!!errors.skillName && errors.skillName.message}</FormErrorMessage>
    </FormControl>
  );
};

const BattleTurn: FC<{ battle: Battle }> = ({ battle }) => {

  const { battleRepository, dialogue } = useIO();
  const lastTurn = getLastTurn(battle);
  const actor = nextActor(battle);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    control,
  } = useForm<DoSkillForm>({ resolver: zodResolver(doSkillFormSchema) });

  const { fields, replace } = useFieldArray({ control, name: 'receiversWithIsVisitor' });
  const [message, setMessage] = useState<string>('');

  const actSkill = async (doSkillForm: DoSkillForm) => {

    const result = await act(dialogue, battleRepository)(battle, actor, doSkillForm, lastTurn);

    if (result instanceof DataNotFoundError) {
      setMessage('入力してください');
      return;
    }

    if (result instanceof ReceiverDuplicationError) {
      setMessage(result.message);
      return;
    }

    if (result instanceof UserCancel) {
      setMessage(result.message);
      return;
    }

    replace([]);
  };

  const isVisitorTag = actor.isVisitor ? (<Tag>{'VISITOR'}</Tag>) : (<Tag>{'HOME'}</Tag>);
  const skill = skillRepository.get(getValues('skillName'))

  return (
    <Box p={4}>
      <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      <Text>This is the battle page</Text>
      {battle.result !== GameOngoing && <Button type="button" onClick={() => battleRepository.exportJson(battle, '')} >Export</Button>}
      <GameResultView battle={battle} />
      {battle.result === GameOngoing && (
        <>
          <form onSubmit={handleSubmit(actSkill)}>
            {message && (<FormErrorMessage>{message}</FormErrorMessage>)}
            {battle.result === GameOngoing && <Surrender battle={battle} actor={actor} />}
            <Box as={'dl'}>
              <Heading as={'dt'}>battle title</Heading>
              <Text as={'dd'}>{battle.title}</Text>
            </Box>
            <Text>{`${actor.name}のターン`}{isVisitorTag}</Text>
            <SkillSelect
              actor={actor}
              getValues={getValues}
              register={register}
              errors={errors}
              replace={replace}
            />
            <List>
              {fields.map((item, index) => (
                <ListItem key={`receiversWithIsVisitor.${index}`}>
                  {skill && (<ReceiverSelect battle={battle} actor={actor} lastTurn={lastTurn} skill={skill} getValues={getValues} register={register} index={index} />)}
                </ListItem>
              ))}
            </List>
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">実行</Button>
          </form>
          <Box>
            <List>
              {lastTurn.sortedCharactors.map(charactor => (
                <ListItem key={`CharactorDetail-${charactor.name}-${isVisitorString(charactor.isVisitor)}`}>
                  <CharactorDetail charactor={charactor} />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
};

export const BattleNew: FC<{}> = () => {

  const { battleRepository } = useIO();
  const router = useRouter()

  const [message, setMessage] = useState<string>('');
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<{ title: string }>();
  const [homeParty, setHomeParty] = useState<Party | null>(null);
  const [visitorParty, setVisitorParty] = useState<Party | null>(null);

  const startBattle = async (battleTitle: any) => {
    const messages: string[] = [];

    const { title } = battleTitle;
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

    const battle = createBattle(title as string, homeParty as Party, visitorParty as Party);
    const turn = start(battle, new Date(), createRandoms());
    battle.turns.push(turn);

    const firstWaiting = nextActor(battle);
    battle.turns.push(wait(battle, firstWaiting.restWt, new Date(), createRandoms()));

    await battleRepository.save(battle);
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
        <ImportParty type='HOME' party={homeParty} setParty={setHomeParty}/>
        <ImportParty type='VISITOR' party={visitorParty} setParty={setVisitorParty}/>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">Start Battle</Button>
      </form>
    </Box>
  );
};
