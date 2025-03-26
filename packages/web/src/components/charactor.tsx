import type { FC } from 'react';
import type { Acquirement } from '@motojouya/kniw-core/model/acquirement';
import type { Charactor } from '@motojouya/kniw-core/model/charactor';
import type { PartyForm } from '../form/party';

import { useState } from 'react';
import {
  Field,
  Control,
  Controller,
  FieldError,
  FieldErrors,
  Merge,
  FieldErrorsImpl,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormGetValues,
} from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Button,
  TextField,
  Box,
  Stack,
  Typography,
} from '@mui/material';

import { NotWearableErorr } from '@motojouya/kniw-core/model/acquirement';
import { DataNotFoundError } from '@motojouya/kniw-core/store_utility/schema';
import {
  raceRepository,
  blessingRepository,
  clothingRepository,
  weaponRepository,
} from '@motojouya/kniw-core/store/acquirement';
import {
  isBattling,
  getPhysical,
  getAbilities,
  getSkills,
} from '@motojouya/kniw-core/model/charactor';
import { toCharactor } from '../form/charactor';
import { EmptyParameter } from '../io/window_dialogue';

type GetCharactorError = (errors: FieldErrors, i: number, property: string) => FieldError | undefined;
const getCharactorError: GetCharactorError = (errors, i, property) => {
  const errorsCharactors = errors.charactors;
  if (!errorsCharactors) {
    return errorsCharactors;
  }
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorsCharactorIndexed = (errorsCharactors as Merge<FieldError, FieldErrorsImpl<any>>)[i];
  if (!errorsCharactorIndexed) {
    return errorsCharactorIndexed;
  }
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = (errorsCharactorIndexed as Merge<FieldError, FieldErrorsImpl<any>>)[property];
  if (!error) {
    return error;
  }

  return error as FieldError;
};

// TODO working select tag https://www.chakra-ui.com/docs/components/select
const SelectAcquirement: FC<{
  name: string,
  keyPrefix: string,
  allAcquirements: Acquirement[],
  field: Field,
  onBlur: () => void,
  error: FieldError | undefined,
}> = ({ name, keyPrefix, allAcquirements, field, onBlur, error }) => {
  return (
    <FormControl error={!!error}>
      <InputLabel id={`${keyPrefix}.select_label`}>{name}</InputLabel>
      <Select
        labelId={`${keyPrefix}.select_label`}
        id={`${keyPrefix}.select`}
        name={field.name}
        value={field.value}
        label={name}
        onChange={field.onChange}
        onBlur={onBlur}
      >
        {allAcquirements.map(acquirement => (
          <MenuItem key={`${keyPrefix}.${acquirement.name}`} value={acquirement.name}>
            {acquirement.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{!!error && error.message}</FormHelperText>
    </FormControl>
  );
}

export const CharactorDetail: FC<{ charactor: Charactor }> = ({ charactor }) => {
  const physical = getPhysical(charactor);

  const abilities = getAbilities(charactor);
  const abilitiesText = abilities.map(ability => ability.label).join(', ');

  const skills = getSkills(charactor);
  const skillsText = skills.map(skill => skill.label).join(', ');

  let hpText: string;
  let mpText: string;
  let wtText: string;
  let statusesText: string;
  let isVisitorTag;

  if (isBattling(charactor)) {
    hpText = `${charactor.hp}/${physical.MaxHP}`;
    mpText = `${charactor.mp}/${physical.MaxMP}`;
    wtText = `${charactor.restWt}(${physical.WT})`;
    statusesText = charactor.statuses.map(attachedStatus => `${attachedStatus.status.label}(${attachedStatus.restWt})`).join(', ');
    isVisitorTag = <Chip label={charactor.isVisitor ? 'VISITOR' : 'HOME'} variant="outlined" />;

  } else {
    hpText = `${physical.MaxHP}`;
    mpText = `${physical.MaxMP}`;
    wtText = `${physical.WT}`;
    statusesText = 'No Status';
    isVisitorTag = null;
  }

  return (
    <TableContainer>
      <Table variant='line'>
        <TableBody>
          <TableRow>
            <TableCell>名前      </TableCell><TableCell>{`${charactor.name}`}{isVisitorTag}    </TableCell>
            <TableCell>HP        </TableCell><TableCell>{hpText}                               </TableCell>
            <TableCell>MP        </TableCell><TableCell>{mpText}                               </TableCell>
            <TableCell>WT        </TableCell><TableCell>{wtText}                               </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>ステータス</TableCell><TableCell colSpan={6}>{statusesText} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>種族      </TableCell><TableCell>{charactor.race.label}                 </TableCell>
            <TableCell>祝福      </TableCell><TableCell>{charactor.blessing.label}             </TableCell>
            <TableCell>装備      </TableCell><TableCell>{charactor.clothing.label}             </TableCell>
            <TableCell>武器      </TableCell><TableCell>{charactor.weapon.label}               </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>アビリティ</TableCell><TableCell colSpan={6}>{abilitiesText}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>スキル    </TableCell><TableCell colSpan={6}>{skillsText}   </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>STR       </TableCell><TableCell>{physical.STR}                         </TableCell>
            <TableCell>VIT       </TableCell><TableCell>{physical.VIT}                         </TableCell>
            <TableCell>DEX       </TableCell><TableCell>{physical.DEX}                         </TableCell>
            <TableCell>AGI       </TableCell><TableCell>{physical.AGI}                         </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>AVD       </TableCell><TableCell>{physical.AVD}                         </TableCell>
            <TableCell>INT       </TableCell><TableCell>{physical.INT}                         </TableCell>
            <TableCell>MND       </TableCell><TableCell>{physical.MND}                         </TableCell>
            <TableCell>RES       </TableCell><TableCell>{physical.RES}                         </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>刺突耐性  </TableCell><TableCell>{physical.StabResistance}              </TableCell>
            <TableCell>斬撃耐性  </TableCell><TableCell>{physical.SlashResistance}             </TableCell>
            <TableCell>打撃耐性  </TableCell><TableCell>{physical.BlowResistance}              </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>火属性    </TableCell><TableCell>{physical.FireSuitable}                </TableCell>
            <TableCell>岩属性    </TableCell><TableCell>{physical.RockSuitable}                </TableCell>
            <TableCell>水属性    </TableCell><TableCell>{physical.WaterSuitable}               </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>氷属性    </TableCell><TableCell>{physical.IceSuitable}                 </TableCell>
            <TableCell>風属性    </TableCell><TableCell>{physical.AirSuitable}                 </TableCell>
            <TableCell>雷属性    </TableCell><TableCell>{physical.ThunderSuitable}             </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>移動距離  </TableCell><TableCell>{physical.move}                        </TableCell>
            <TableCell>移動高さ  </TableCell><TableCell>{physical.jump}                        </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const CharactorCard: FC<{
  register: UseFormRegister<PartyForm>,
  getValues: UseFormGetValues<PartyForm>,
  remove: (index?: number | number[]) => void,
  errors: FieldErrors<PartyForm>,
  index: number,
  control: Control,
}> = ({ register, getValues, remove, errors, index, control }) => {

  const nameError = getCharactorError(errors, index, 'name');
  const [charactor, setCharactor] = useState<Charactor | string>('入力してください');

  const onBlur = () => {
    const hiredCharactor = toCharactor(getValues(`charactors.${index}` as const));

    if (hiredCharactor instanceof DataNotFoundError || hiredCharactor instanceof EmptyParameter) {
      setCharactor('入力してください');
      return;
    }
    if (hiredCharactor instanceof NotWearableErorr) {
      setCharactor('選択できない組み合わせです');
      return;
    }
    setCharactor(hiredCharactor);
  };

  return (
    <Stack direction="column" border='solid' sx={{ p: 3, justifyContent: "flex-start" }}>
      <Stack direction="column" sx={{ justifyContent: "flex-start" }}>
        <TextField
          error={!!nameError}
          label="Name"
          placeholder="Name"
          variant="outlined"
          {...register(`charactors.${index}.name` as const, { onBlur })}
          helperText={!!nameError && nameError.message}
          sx={{ pb: 1 }}
        />
        <Controller
          name={`charactors.${index}.race`}
          control={control}
          render={({ field }) => (
            <SelectAcquirement
              name={'race'}
              keyPrefix={`charactors.${index}.race`}
              allAcquirements={raceRepository.all}
              error={getCharactorError(errors, index, 'race')}
              field={field}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name={`charactors.${index}.blessing`}
          control={control}
          render={({ field }) => (
            <SelectAcquirement
              name={'blessing'}
              keyPrefix={`charactors.${index}.blessing`}
              allAcquirements={blessingRepository.all}
              error={getCharactorError(errors, index, 'blessing')}
              field={field}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name={`charactors.${index}.clothing`}
          control={control}
          render={({ field }) => (
            <SelectAcquirement
              name={'clothing'}
              keyPrefix={`charactors.${index}.clothing`}
              allAcquirements={clothingRepository.all}
              error={getCharactorError(errors, index, 'clothing')}
              field={field}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          name={`charactors.${index}.weapon`}
          control={control}
          render={({ field }) => (
            <SelectAcquirement
              name={'weapon'}
              keyPrefix={`charactors.${index}.weapon`}
              allAcquirements={weaponRepository.all}
              error={getCharactorError(errors, index, 'weapon')}
              field={field}
              onBlur={onBlur}
            />
          )}
        />
      </Stack>
      <Box>
        <Button variant="contained" type="button" onClick={() => remove(index)}>Fire</Button>
      </Box>
      <Box>
        {typeof charactor === 'string' ? <Typography>{charactor}</Typography> : <CharactorDetail charactor={charactor} />}
      </Box>
    </Stack>
  );
};
