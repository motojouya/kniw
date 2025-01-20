import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { Skill } from '@motojouya/kniw/src/domain/skill';
import type { Turn } from '@motojouya/kniw/src/domain/turn';
import type { DoSkillForm } from '@motojouya/kniw/src/form/battle';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  useFieldArray,
  FieldErrors,
  UseFormRegister,
  UseFormGetValues,
  UseFieldArrayReplace,
} from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Button,
  Box,
  List,
  ListItem,
  Heading,
  Text,
  Tag,
  Select,
} from '@chakra-ui/react';

import {
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw,
  nextActor,
  getLastTurn,
} from '@motojouya/kniw/src/domain/battle';
import { CharactorDetail } from '@motojouya/kniw/src/components/charactor';
import {
  doSkillFormSchema,
  receiverSelectOption,
  ReceiverDuplicationError,
} from '@motojouya/kniw/src/form/battle';
import { ACTION_DO_NOTHING } from '@motojouya/kniw/src/domain/turn';
import { getSkills, isVisitorString } from '@motojouya/kniw/src/domain/charactor';
import { skillRepository } from '@motojouya/kniw/src/store/skill';
import { MAGIC_TYPE_NONE } from '@motojouya/kniw/src/domain/skill';

import { underStatus } from '@motojouya/kniw/src/domain/status';
import { silent } from '@motojouya/kniw/src/data/status';
import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { act } from '@motojouya/kniw/src/web/case/battle/act';
import { surrender } from '@motojouya/kniw/src/web/case/battle/surrender';
import { selectReceiver } from '@motojouya/kniw/src/web/case/battle/selectReceiver';
import { skillReceiverCount } from '@motojouya/kniw/src/web/case/battle/skillReceiverCount';
import { UserCancel } from '@motojouya/kniw/src/io/window_dialogue';
import { useIO } from '@motojouya/kniw/src/components/context';
import { Link } from '@motojouya/kniw/src/components/utility';

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
    const result = selectReceiver(battle, actor, skill, receiverWithIsVisitor, lastTurn, new Date());

    if (result instanceof DataNotFoundError) {
      setReceiverResult(null);
      return;
    }

    const { survive, receiver } = result;

    if (!survive) {
      setReceiverResult(`${receiver.name} will dead`);
      return;
    }

    setReceiverResult(receiver);
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
    const receiverCount = skillReceiverCount(skillName);
    replace(Array(receiverCount).fill(''));
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

export const BattleTurn: FC<{ battle: Battle }> = ({ battle }) => {

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
      <Link href='/battle/'><span>戻る</span></Link>
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
