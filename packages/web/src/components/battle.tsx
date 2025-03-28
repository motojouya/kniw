import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw-core/model/battle';
import type { CharactorBattling } from '@motojouya/kniw-core/model/charactor';
import type { Skill } from '@motojouya/kniw-core/model/skill';
import type { Turn } from '@motojouya/kniw-core/model/turn';
import type { DoSkillForm } from '../form/battle';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  useFieldArray,
  FieldErrors,
  UseFormRegister,
  UseFormGetValues,
  UseFieldArrayReplace,
  Controller,
} from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Button,
  TextField,
  Box,
  Stack,
  Typography,
} from '@mui/material';

import {
  GameOngoing,
  GameHome,
  GameVisitor,
  GameDraw,
  nextActor,
  getLastTurn,
} from '@motojouya/kniw-core/model/battle';
import { CharactorDetail } from './charactor';
import {
  doSkillFormSchema,
  toSkill,
  receiverSelectOption,
  ReceiverDuplicationError,
} from '../form/battle';
import { ACTION_DO_NOTHING } from '@motojouya/kniw-core/model/turn';
import { getSkills, isVisitorString } from '@motojouya/kniw-core/model/charactor';
import { skillRepository } from '@motojouya/kniw-core/store/skill';
import { MAGIC_TYPE_NONE } from '@motojouya/kniw-core/model/skill';

import { underStatus } from '@motojouya/kniw-core/model/status';
import { silent } from '@motojouya/kniw-core/store_data/status/index';
import { DataNotFoundError } from '@motojouya/kniw-core/store_utility/schema';
import { act } from '../procedure/battle/act';
import { surrender } from '../procedure/battle/surrender';
import { simulate } from '../procedure/battle/simulate';
import { UserCancel } from '../io/window_dialogue';
import { useIO } from './context';
import { Container, Link } from './utility';

const GameStatus: FC<{ battle: Battle }> = ({ battle }) => {
  const card = `${battle.home.name}(HOME) vs ${battle.visitor.name}(VISITOR)`;
  switch (battle.result) {
    case GameHome: return <Typography>{`${card} HOME側の勝利`}</Typography>;
    case GameVisitor: return <Typography>{`${card} VISITOR側の勝利`}</Typography>;
    case GameDraw: return <Typography>{`${card} 引き分け`}</Typography>;
    default: return <Typography>{`${card} Turn No.${battle.turns.length}`}</Typography>;
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
  control: Control,
}> = ({ battle, actor, lastTurn, skill, index, getValues, register, control }) => {

  const formItemName = `receiversWithIsVisitor.${index}.value` as const;
  const [receiverResult, setReceiverResult] = useState<CharactorBattling | string | null>(null);

  const onBlur = () => {

    const receiverWithIsVisitor = getValues(formItemName);
    const result = simulate(battle, actor, skill, receiverWithIsVisitor, lastTurn, new Date());

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
      <Controller
        name={formItemName}
        control={control}
        render={({ field }) => (
          <FormControl error={!!error}>
            <InputLabel id="receiver_label">receiver</InputLabel>
            <Select
              labelId='receiver_label'
              id='receiver_select'
              name={field.name}
              value={field.value}
              label='receiver'
              onChange={field.onChange}
              onBlur={onBlur}
            >
              {receiverOptions.map(receiverOption => (
                <MenuItem key={`${receiverOption.value}`} value={receiverOption.value}>
                  {receiverOption.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{!!error && error.message}</FormHelperText>
          </FormControl>
        )}
      />
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

  return <Button variant='outlined' type="button" onClick={doSurrender} >降参</Button>;
};

const SkillSelect: FC<{
  actor: CharactorBattling,
  replace: UseFieldArrayReplace<DoSkillForm, 'receiversWithIsVisitor'>
  getValues: UseFormGetValues<DoSkillForm>,
  register: UseFormRegister<DoSkillForm>,
  errors: FieldErrors<DoSkillForm>,
  control: Control,
}> = ({ actor, replace, getValues, register, errors, control }) => {

  const skills = getSkills(actor);
  const skillOptions = skills
    .filter(skill => skill.mpConsumption <= actor.mp)
    .filter(skill => !underStatus(silent, actor) || skill.magicType === MAGIC_TYPE_NONE)
    .map(skill => ({ value: skill.name, label: skill.name }));
  skillOptions.push({ value: ACTION_DO_NOTHING, label: '何もしない' });

  const onBlur = () => {
    const skillName = getValues('skillName');
    const skill = toSkill(skillName);
    if (skill) {
      replace(Array(skill.receiverCount).fill(''));
    } else {
      replace([]);
    }
  };

  return (
    <Controller
      name='skillName'
      control={control}
      render={({ field }) => (
        <FormControl error={!!errors.skillName}>
          <InputLabel id="skill_label">skill</InputLabel>
          <Select
            labelId='skill_label'
            id='skill_select'
            name={field.name}
            value={field.value}
            label='skill'
            onChange={field.onChange}
            onBlur={onBlur}
          >
            {skillOptions.map(skillOption => (
              <MenuItem key={`${skillOption.value}`} value={skillOption.value}>
                {skillOption.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{!!errors.skillName && errors.skillName.message}</FormHelperText>
        </FormControl>
      )}
    />
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
    formState: { errors }, //, isSubmitting
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

  const skill = skillRepository.get(getValues('skillName'))
  console.log(fields);

  // FIXME Button loading={isSubmitting} loadingText="executing action..." としたかったがloadingがエラーになる
  return (
    <Container backLink="/battle/">
      <Stack>
        <Stack>
          <Stack direction="row" sx={{ justifyContent: "space-between", width: '100%' }}>
            <Box flex="0 0 70px"><Typography>Battle!</Typography></Box>
            <Box flex="1 0 110px"><Typography>{battle.title}</Typography></Box>
            <Box flex="1 1 auto">{battle.result !== GameOngoing && <Button type="button" onClick={() => battleRepository.exportJson(battle, '')} >Export</Button>}</Box>
          </Stack>
          <Box>
            <GameStatus battle={battle} />
          </Box>
        </Stack>
        {battle.result === GameOngoing && (
          <Stack>
            <form onSubmit={handleSubmit(actSkill)}>
              {message && (<Typography>{message}</Typography>)}
              <Box>
                <Typography display="inline-block" sx={{ pr: 1 }}>{`${actor.name}のターン`}</Typography>
                <Chip variant="outlined" color='primary' label={actor.isVisitor ? 'VISITOR' : 'HOME'} />
              </Box>
              <Stack>
                <SkillSelect
                  actor={actor}
                  getValues={getValues}
                  register={register}
                  errors={errors}
                  replace={replace}
                  control={control}
                />
              </Stack>
              <Stack sx={{ justifyContent: "flex-start", p: 1, width: '100%' }}>
                {fields.map((item, index) => (
                  <Box key={`receiversWithIsVisitor.${index}`}>
                    {skill && (
                      <ReceiverSelect
                        battle={battle}
                        actor={actor}
                        lastTurn={lastTurn}
                        skill={skill}
                        getValues={getValues}
                        register={register}
                        index={index}
                        control={control}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
              <Stack>actor to receiver images here with each charactor statuses</Stack>
              <Button type="submit" variant='outlined'>実行</Button>
              {battle.result === GameOngoing && <Surrender battle={battle} actor={actor} />}
            </form>
            <Box>
              <Stack sx={{ justifyContent: "flex-start", p: 1, width: '100%' }}>
                {lastTurn.sortedCharactors.map(charactor => (
                  <Box key={`CharactorDetail-${charactor.name}-${isVisitorString(charactor.isVisitor)}`}>
                    <CharactorDetail charactor={charactor} />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};
