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
import { CharactorDetail, CharactorStatus } from './charactor';
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

type GetReceiverError = (errors: FieldErrors, i: number) => FieldError | undefined;
const getReceiverError: GetReceiverError = (errors, i, property) => {
  const errorsReceivers = errors.receiversWithIsVisitor;
  if (!errorsReceivers) {
    return errorsReceivers;
  }
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorsReceiverIndexed = (errorsReceivers as Merge<FieldError, FieldErrorsImpl<any>>)[i];
  if (!errorsReceiverIndexed) {
    return errorsReceiverIndexed;
  }
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = (errorsReceiverIndexed as Merge<FieldError, FieldErrorsImpl<any>>)['value'];
  if (!error) {
    return error;
  }

  return error as FieldError;
};

const ReceiverSelect: FC<{
  lastTurn: Turn,
  index: number,
  errors: FieldErrors<DoSkillForm>,
  control: Control,
  addReceiver: () => void,
}> = ({ lastTurn, index, errors, control, addReceiver }) => {

  const formItemName = `receiversWithIsVisitor.${index}.value` as const;
  const error = getReceiverError(errors, index);

  // FIXME useCallback
  const onChange = (field) => (e) => {
    field.onChange(e);
    addReceiver();
  };

  const receiverOptions = lastTurn.sortedCharactors.map(receiverSelectOption);

  return (
    <>
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
              onChange={onChange(field)}
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
    </>
  );
};

const Surrender: FC<{ battle: Battle, actor: CharactorBattling }> = ({ battle, actor }) => {
  const { battleRepository, dialogue } = useIO();
  // FIXME 降参した後にbattleの状態を変化させる気がするがどうかな
  const doSurrender = () => surrender(battleRepository, dialogue)(battle, actor, new Date());

  return <Button variant='outlined' type="button" onClick={doSurrender}>降参</Button>;
};

const SkillSelect: FC<{
  actor: CharactorBattling,
  replace: UseFieldArrayReplace<DoSkillForm, 'receiversWithIsVisitor'>
  getValues: UseFormGetValues<DoSkillForm>,
  errors: FieldErrors<DoSkillForm>,
  control: Control,
}> = ({ actor, replace, getValues, errors, control }) => {

  const skills = getSkills(actor);
  const skillOptions = skills
    .filter(skill => skill.mpConsumption <= actor.mp)
    .filter(skill => !underStatus(silent, actor) || skill.magicType === MAGIC_TYPE_NONE)
    .map(skill => ({ value: skill.name, label: skill.name }));
  skillOptions.push({ value: ACTION_DO_NOTHING, label: '何もしない' });

  // FIXME useCallback
  const onChange = (field) => (e) => {
    const skillName = e.target.value;
    const skill = toSkill(skillName);
    if (skill) {
      replace(Array(skill.receiverCount).fill(''));
    } else {
      replace([]);
    }
    field.onChange(e);
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
            onChange={onChange(field)}
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
    getValues,
    formState: { errors }, //, isSubmitting
    control,
  } = useForm<DoSkillForm>({ resolver: zodResolver(doSkillFormSchema) });

  const { fields, replace } = useFieldArray({ control, name: 'receiversWithIsVisitor' });
  const [message, setMessage] = useState<string>('');
  const [receivers, setReceivers] = useState<(CharactorBattling | null)[]>([]);

  const skill = skillRepository.get(getValues('skillName'))

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

    setReceivers([]);
    replace([]);
  };

  const addReceiver = (index) => () => {
    const receiverWithIsVisitor = getValues(`receiversWithIsVisitor.${index}.value` as const);
    const result = simulate(battle, actor, skill, receiverWithIsVisitor, lastTurn, new Date());

    if (result instanceof DataNotFoundError) {
      if (receivers.length > index) {
        setReceivers(receivers.toSpliced(index, 1, null));
      }
      return;
    }

    const { receiver } = result;

    let newReceivers = [...receivers];
    if (receivers.length <= index) {
      const shortage = index - receivers.length + 1;
      newReceivers = newReceivers.concat(Array(shortage).fill(null));
    }
    setReceivers(newReceivers.toSpliced(index, 1, receiver));
  };

  // FIXME Button loading={isSubmitting} loadingText="executing action..." としたかったがloadingがエラーになる
  return (
    <Container backLink="/battle/">
      <Stack>
        <Stack sx={{ pb: 1 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", width: '100%' }}>
            <Box flex="0 0 70px"><Typography>Battle!</Typography></Box>
            <Box flex="1 0 110px"><Typography>{battle.title}</Typography></Box>
            <Box flex="1 1 auto">{battle.result !== GameOngoing && <Button type="button" variant='outlined' onClick={() => battleRepository.exportJson(battle, '')} >Export</Button>}</Box>
          </Stack>
          <Box>
            <GameStatus battle={battle} />
          </Box>
        </Stack>
        {battle.result === GameOngoing && (
          <Stack borderTop='1px solid royalblue'>
            <form onSubmit={handleSubmit(actSkill)}>
              {message && (<Typography>{message}</Typography>)}
              <Box sx={{ py: 1 }}>
                <Typography display="inline-block" sx={{ pr: 1 }}>{`${actor.name}のターン`}</Typography>
                <Chip variant="outlined" color='primary' label={actor.isVisitor ? 'VISITOR' : 'HOME'} />
              </Box>
              <Stack>
                <SkillSelect
                  actor={actor}
                  getValues={getValues}
                  errors={errors}
                  replace={replace}
                  control={control}
                />
              </Stack>
              <Stack sx={{ justifyContent: "flex-start", p: 1, width: '100%' }}>
                {fields.map((item, index) => (
                  <Stack key={`receiversWithIsVisitor.${index}`}>
                    {skill && (
                      <ReceiverSelect
                        lastTurn={lastTurn}
                        index={index}
                        errors={errors}
                        control={control}
                        addReceiver={addReceiver(index)}
                      />
                    )}
                  </Stack>
                ))}
              </Stack>
              <Stack>
                <Box>
                  <CharactorStatus charactor={actor} />
                </Box>
                <Box>
                  <Typography>images here</Typography>
                </Box>
                {receivers.map((receiver, index) => (
                  receiver && <Stack sx={{ pl: 2 }}><CharactorStatus charactor={receiver} /></Stack>
                ))}
              </Stack>
              <Stack direction='row' sx={{ justifyContent: "flex-end", py: 1 }}>
                <Box sx={{ px: 1 }}>
                  <Button type="submit" variant='outlined' sx={{ px: 1 }}>実行</Button>
                </Box>
                {battle.result === GameOngoing && (
                  <Box sx={{ px: 1 }}>
                    <Surrender battle={battle} actor={actor} />
                  </Box>
                )}
              </Stack>
            </form>
            <Box borderTop='1px solid royalblue' sx={{ py: 1 }}>
              <Box>
                <Typography variant='h5'>Action Orders</Typography>
              </Box>
              <Stack sx={{ justifyContent: "flex-start", p: 1, width: '100%' }}>
                {lastTurn.sortedCharactors.map((charactor, index) => (
                  <Box key={`CharactorDetail-${charactor.name}-${isVisitorString(charactor.isVisitor)}`} sx={{ pb: 2 }}>
                    <Box borderBottom='1px dotted royalblue'>
                      <Typography variant="h6">{index === 0 ? 'Next Actor' : `Action Order ${index + 1}`}</Typography>
                    </Box>
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
